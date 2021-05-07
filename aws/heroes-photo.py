# ---------------------------------------------------------------
# Salva ou recupera o encode base64 dos bytes da
# foto(imagem) de um herói.
#
# Parâmetros esperados: 
#   String fileId = ID do arquivo que conterá o encode base64
#   String action = "save" or "load" (image)
# 
# Retorna um dict com os atributos:
#   success: (bool)true/False
#   message: (str)Mensagem de erro/falha quando houver
#   b64: (str)Base64 encode  
# ---------------------------------------------------------------

import json
import boto3                 

def lambda_handler(event, context):
    ret = {'success': True, 'message': '', 'b64': ''}
    
    if 'body' in event:
        event = json.loads(event["body"])
        
    if 'action' not in event.keys() or event['action'].strip() == '':
        ret['success'] = False
        ret['message'] = 'a Ação inválida.'
    elif 'fileId' not in event.keys() or event['fileId'].strip() == '':
        ret['success'] = False
        ret['message'] = 'O ID do arquivo é inválido.'        
    else:         
       bucket = 'herois'
       file_name = 'images/' + event['fileId'].strip() + '.b64'

       try:
          s3 = boto3.client('s3')
          if (event['action'] == 'save'):
             s3.put_object(Body=event['b64'], Bucket=bucket, Key=file_name)
          else:
             file = s3.get_object(Bucket=bucket, Key=file_name)
             ret['b64'] = file['Body'].read()
       except Exception as e:
          # Outros erros genéricos - Registra...
          ret['success'] = False
          ret['message'] = str(e)

    return ret       