# HEROES - O ring dos heróis!

Cadastre seus heróis favoritos e os coloque em combate. Deixe
que a tecnologia decida quem vencerá!!

---

Essa aplicação web, foi desenvolvida com o Flutter 2.0.6.

Faz chamadas para APIs do AWS Lambda escritas em Python e disponibilizadas
na pasta aws. Para banco de dados utiliza o DynamoDB no AWS.

As APIs estarão ativas até o dia 10/05/2021. Após essa data,
você poderá testar utilizando os códigos em Python fornecidos, na sua conta AWS ou
em outro servidor web qualquer.
Nesse caso, você terá que baixar os fontes do projeto em flutter, do repositório 
https://github.com/bellonauta/heroes.git e promover as alterações, nos endereços
das APIs, no arquivo lib/core/app_consts.dart e gerar novo build web da aplicação.

---

Instruções para o deploy:

1. Fazer o deploy desse repositório na pasta web desejada;
2. Editar o arquivo index.html e substituir o href pelo endereço http do 
   servidor web e pasta escolhida. Ex: <base href="http://dominio.com/heroes/">
3. No browser, digitar o endereço da aplicação. Ex: http://dominio.com/heroes/index.php
   
E-mail para esclarecimentos rápidos:
wilsom.angeli@gmail.com
