# ------------------------------------------------------------------------------
# Retorna a lista de todos os heróis cadastrados
# ou somente dos favoritos.
#
# Parâmetros esperados: 
#   String favoritos = "S" para retornar somente heróis favoritos ou
#                      "N" para retornar todos
# 
# Retorna um dict com os atributos:
#   success: (bool)true/False
#   message: (str)Mensagem de erro/falha quando houver
#   heroes: (List)Uma lista de dicts com os atributos de cada herói
# ------------------------------------------------------------------------------

import json
import boto3
import time
from boto3.dynamodb.conditions import Key, Attr

from botocore.exceptions import ClientError
 

def lambda_handler(event, context):
    ret = {'success': True, 'message': '', 'heroes': []}
    
    table_name = 'heroes'  # Nome da tabela de cadastro dos heróis

    if 'body' in event:
        event = json.loads(event["body"])
    
    favoritos = ('favoritos' in event.keys() and event['favoritos'] == 'S')
    
    if not favoritos:
       # Todos os heróis...
       db = boto3.client('dynamodb')
       last_evaluated_key = None
       try:
          while True:
             if last_evaluated_key:
                response = db.scan(
                     TableName=table_name,
                     ExclusiveStartKey=last_evaluated_key
                 )
             else: 
                response = db.scan(TableName=table_name)
             last_evaluated_key = response.get('LastEvaluatedKey')
           
             ret['heroes'].extend(response['Items'])
          
             if not last_evaluated_key:
                break
       except Exception as e:
          # Outros erros genéricos - Registra...
          ret['success'] = False
          ret['message'] = str(e)   
          ret['heroes'] = []
    else:
        try:
           table = boto3.resource('dynamodb').Table(table_name) 
           response = table.scan(
                                  FilterExpression=Attr("favorito").eq('S')
                                )
           # response = table.query( ConditionExpression=Attr('favorito').contains('S') )
           ret['heroes'].extend(response['Items'])
        except Exception as e:
           # Outros erros genéricos - Registra...
           ret['success'] = False
           ret['message'] = str(e)   
           ret['heroes'] = []   
       
    if ret['success'] and len(ret['heroes']) > 0:
       # Pega as fotos(base64 encoded) de cada herói...    
       bucket = 'herois'
       s3 = boto3.client('s3')
       
       for h in range(len(ret['heroes'])):
          if not favoritos:
             id = ret['heroes'][h]['id']['S']
          else:
             id = ret['heroes'][h]['id']

          file_name = 'images/' + id + '.b64'

          try:
             file = s3.get_object(Bucket=bucket, Key=file_name)
             if not favoritos:
                ret['heroes'][h]['photo'] = {'S': file['Body'].read()}
             else:
                ret['heroes'][h]['photo'] = file['Body'].read()
          except Exception as e:
             # Outros erros genéricos - Registra...
             ret['success'] = False
             ret['message'] = str(e)
        
    return ret