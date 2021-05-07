# ---------------------------------------------------------------
# Executa manutenções(CRUDs) nos cadastros dos heróis.
#
# Parâmetros esperados: 
#   String action = "insert", "update", "delete" ou "favorite"
#   String id = ID do herói(obrigatório sempre que action != "insert")
#   String action = "save" or "load" (image)
#   String nome = Nome do herói (Obrigatório sempre que action for "insert" ou "update")
#   String universo = Universo do herói (Obrigatório sempre que action for "insert" ou "update")
#   String altura = Altura do herói (Obrigatório sempre que action for "insert" ou "update")
#   String velocidade = Velocidade do herói (Obrigatório sempre que action for "insert" ou "update")
#   String peso = Peso do herói (Obrigatório sempre que action for "insert" ou "update")
#   String favorito = 'S' para marcar o herói como favorito(Obrigatório sempre que action for "insert" ou "update" ou "favorite")
#    
# Retorna um dict com os atributos:
#   success: (bool)true/False
#   message: (str)Mensagem de erro/falha quando houver
#   id: (str)ID do herói, quando incluído
# ---------------------------------------------------------------

from datetime import datetime
from hashlib import sha256
import json
import boto3
from boto3.dynamodb.conditions import Key
import time
import base64

from botocore.exceptions import ClientError

def lambda_handler(event, context):
    ret = {'success': True, 'message': '', 'id': ''}
    
    table_name = 'heroes'  # Nome da tabela de cadastro dos heróis
    
    if 'body' in event:
        event = json.loads(event["body"])

    # Valida parâmetros recebidos...
    if type(event) is not dict or 'action' not in event.keys() or event['action'] not in ['insert','delete','update','favorite']:
       ret['success'] = False
       ret['message'] = 'A ação de manutenção é desconhecida. ('+json.dumps(event)+')'
    else:
       try:
          # Wraper de tabela do Dynamo...
          table = boto3.resource('dynamodb').Table(table_name)    
       except Exception as e:
          # Outros erros genéricos - Registra...
          ret['success'] = False
          ret['message'] = str(e)           
        
    if (ret['success']):
       if event['action'] == 'insert':
          # INCLUSÃO DE HERÓI NO CADASTRO...    
          ret['id'] = sha256(event['nome'].encode('utf-8').strip().lower()).hexdigest()
          # Verifica se a chave já existe...
          rows = table.query( KeyConditionExpression=Key('id').eq(ret['id']) )
          if 'Items' in rows and len(rows['Items']) > 0:
             # Já existente...
             ret['success'] = False
             ret['message'] = 'Já existe um herói cadastrado com esse nome.'
          else:
             try:
                table.put_item(
                               Item = {
                                                'id': ret['id'],
                                              'nome': event['nome'].strip(),
                                          'universo': event['universo'].strip(),
                                            'altura': event['altura'],
                                        'velocidade': event['velocidade'],
                                              'peso': event['peso'],
                                          'favorito': 'N'
                                      })
             except ClientError as ce:
                # Outros erros - Registra e sai... 
                ret['success'] = False
                ret['message'] = 'ClientError: ' + str(e)    
             except Exception as e:
                # Outros erros genéricos - Registra e sai...
                ret['success'] = False
                ret['message'] = str(e)
             
       elif 'id' not in event.keys():
          # Não existente...
          ret['success'] = False
          ret['message'] = 'ID do herói não foi enviado no request de manutenção.'  
       else:      
          # ALTERAÇÃO/EXCLUSÃO CADASTRAL DE HERÓI...                
          ret['id'] = event['id']
          # Verifica se a id existe...
          rows = table.query( KeyConditionExpression=Key('id').eq(ret['id']) )
          if 'Items' not in rows or len(rows['Items']) <= 0:
             # Não existente...
             ret['success'] = False
             ret['message'] = 'Esse herói não está mais cadastrado. Pode ter sido excluído por outro usuário.'
             
          elif event['action'] == 'favorite':
             # FAVORITAGEM...    
             try:
                table.update_item(
                                   Key = {
                                           'id': ret['id'],
                                         },
                                   UpdateExpression = "set favorito = :f",
                                   ExpressionAttributeValues = {":f": event['favorito']},
                                   ReturnValues="UPDATED_NEW"
                                 )  
             except ClientError as ce:
                # Outros erros - Registra e sai... 
                ret['success'] = False
                ret['message'] = 'ClientError: ' + str(e)    
             except Exception as e:
                # Outros erros genéricos - Registra e sai...
                ret['success'] = False
                ret['message'] = str(e)                   
              
          elif event['action'] == 'update':
             # ALTERAÇÕES... 
             update = ''
             attrs = {}
          
             if event['nome'].strip() != '':
                update += (', ' if update != '' else '') + 'nome = :n'
                attrs[':n'] = event['nome'].strip()
                
             if event['universo'].strip() != '':
                update += (', ' if update != '' else '') + 'universo = :u'
                attrs[':u'] = event['universo'].strip()

             if event['altura'].strip() != '' and event['altura'].strip() != '0':
                update += (', ' if update != '' else '') +  'altura = :a'
                attrs[':a'] = event['altura'].strip()
             
             if event['velocidade'].strip() != '' and event['velocidade'].strip() != '0':
                update += (', ' if update != '' else '') + 'velocidade = :v'
                attrs[':v'] = event['velocidade'].strip()
          
             if event['peso'].strip() != '' and event['peso'].strip() != '0':
                update += (', ' if update != '' else '') + 'peso = :p'
                attrs[':p'] = event['peso'].strip()
                
             #    
             try:
                table.update_item(
                                   Key = {
                                           'id': ret['id'],
                                         },
                                   UpdateExpression = "set " + update,
                                   ExpressionAttributeValues = attrs,
                                   ReturnValues="UPDATED_NEW"
                                 )  
             except ClientError as ce:
                # Outros erros - Registra e sai... 
                ret['success'] = False
                ret['message'] = 'ClientError: ' + str(e)    
             except Exception as e:
                # Outros erros genéricos - Registra e sai...
                ret['success'] = False
                ret['message'] = str(e)                              
           
          elif event['action'] == 'delete':        
             # EXCLUSÕES... 
             try:
                table.delete_item(
                                   Key = {
                                           'id': ret['id'],
                                         }
                                 )  
             except ClientError as ce:
                # Outros erros - Registra e sai... 
                ret['success'] = False
                ret['message'] = 'ClientError: ' + str(e)    
             except Exception as e:
                # Outros erros genéricos - Registra e sai...
                ret['success'] = False
                ret['message'] = str(e)     
           
          else:
             ret['success'] = False
             ret['message'] = 'Ação de manutenção desconhecida.'
    
    return ret        