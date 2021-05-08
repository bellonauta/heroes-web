# HEROES - O ring dos heróis!

Cadastre seus heróis favoritos e os coloque em combate. Deixe
que a tecnologia decida quem vencerá!!

---
## Essa aplicação web, foi desenvolvida com o Flutter 2.0.6.
Faz chamadas para APIs do AWS Lambda escritas em Python e disponibilizadas
na pasta aws. Para banco de dados utiliza o DynamoDB no AWS.

As APIs estarão ativas até o dia 07/05/2021. Após essa data,
você poderá testar utilizando os códigos em Python fornecidos, na sua conta AWS ou
em outro servidor web qualquer.
Nesse caso, você terá que baixar os fontes do projeto em flutter, do repositório 
https://github.com/bellonauta/heroes.git e promover as alterações, nos endereços
das APIs, no arquivo lib/core/app_consts.dart. Finalmente, gerar novo build web da aplicação.

---
## JavaScript
Na pasta "js" está o arquivo "functions.js" com as funções específicas para
o projeto, feitas com o objetivo de mostrar a facilidade da integração
do flutter com JavaScript. A função JS "combatWinner()", é a que faz o trabalho
"pesado" de decidir quem será o vencedor nos combates.

---
## Instruções para o deploy
1. Fazer o deploy desse repositório na pasta web desejada;
2. Editar o arquivo index.html e substituir o href pelo endereço http/https do 
   servidor web e pasta escolhida. Ex: \<base href="http://dominio.com/heroes/">
3. No browser, digitar o endereço da aplicação. Ex: http://dominio.com/heroes/index.php

---
## ToDo
1. Usar um modelo de ML do Python, para predizer o combatente vitorioso;
2. Colocar os indicadores de progresso em PopUps;
3. Melhorar a responsividade e a UI/UX (Grande desafio para Apps Web em Flutter.);
4. Controlar o tamanho(em bytes) e a qualidade das fotos dos heróis, no upload;
5. Deixar a aplicação estável para multiplataforma(Web, IOS e Android, no mínimo).

---   
E-mail para esclarecimentos rápidos:
wilsom.angeli@gmail.com

