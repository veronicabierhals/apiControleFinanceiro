# API de Controle Financeiro

Esta é uma API RESTful desenvolvida para fornecer funcionalidades relacionadas ao controle financeiro pessoal. As principais operações permitidas pela API incluem:
* o cadastro e autenticação de usuários,
* gerenciamento de categorias,
* registro de transações financeiras (entradas e saídas),
* a obtenção de extrato financeiro.

## Tecnologias Utilizadas
* Node.js
* Express.js
* PostgreSQL (banco de dados)
* Bcrypt (para criptografia de senhas)
* JSON Web Token (JWT - para autenticação via token)
* dotenv (Para configuração de variáveis de ambiente)
* Insomnia (para testes)

## **Banco de dados**
A implementação do banco de dados está na pasta **bancoDeDados**.

## **Endpoints**

### **Cadastrar usuário**

#### `POST` `/usuario`

Esta rota é utilizada para cadastrar um novo usuário no sistema.

**Requisição**

Sem parâmetros de rota ou query.
O body deve possuir um objeto com as seguintes propriedades:
  - nome
  - email
  - senha

**Resposta**  
  Em caso de **sucesso**, a resposta contém os dados do usuário cadastrado, excluindo a senha criptografada.
  Em caso de **falha na validação**, a resposta contém um código de status apropriado e um objeto com a propriedade mensagem explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - Validar os campos obrigatórios:
    - nome
    - email
    - senha
  - Validar se o e-mail informado já existe
  - Criptografar a senha antes de persistir no banco de dados
  - Cadastrar o usuário no banco de dados

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

### **Login do usuário**

#### `POST` `/login`

Esta rota permite que um usuário autenticado realize o login no sistema.

- **Requisição**
  Sem parâmetros de rota ou de query.
  O body deve possuir um objeto com as seguintes propriedades:
  - email
  - senha

**Resposta**

  Em caso de **sucesso**, a resposta terá um objeto com a propriedade token contendo o token de autenticação e a propriedade usuario contendo as informações do usuário autenticado (exceto a senha).
  Em caso de **falha na validação**, a resposta contém um código de status apropriado e um objeto com a propriedade mensagem explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**

  - Verificar se o e-mail existe
  - Validar e-mail e senha
  - Criar token de autenticação com id do usuário

#### **Exemplo de requisição para teste**

```javascript
// POST /login
{
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de respostas**

```javascript
{
    "usuario": {
        "id": 1,
        "nome": "José",
        "email": "jose@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

```javascript
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```

### **Validar Tokenn**

- **REQUISITOS OBRIGATÓRIOS**
  - Validar se o token foi enviado no header da requisição (Bearer Token)
  - Verificar se o token é válido
  - Consultar usuário no banco de dados pelo ID contido no token informado

### **Detalhar Perfil do Usuário Logado**

#### `GET` `/usuario`

sta rota é chamada quando o usuário deseja obter os dados do seu próprio perfil.

**Requisição**  

  Sem parâmetros de rota ou de query.  
  Não deve possuir conteúdo no body da requisição.

**Resposta**  
  Em caso de **sucesso**, a resposta contém um objeto representando o usuário encontrado, com todas as suas propriedades (exceto a senha).  
  Em caso de **falha na validação**, a resposta contém um código de status apropriado e um objeto com a propriedade mensagem explicando o motivo da falha.  

#### **Exemplo de requisição para teste**

```javascript
// GET /usuario
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de respostas**

```javascript
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```
```
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

### **Atualizar Perfil do Usuário Logado**

#### `PUT` `/usuario`

Esta rota é chamada quando o usuário deseja realizar alterações no seu próprio perfil.

- **Requisição**  
Sem parâmetros de rota ou de query.  
O body da requisição deve conter um objeto com as seguintes propriedades:
  - nome
  - email
  - senha

- **Resposta**  
  Em caso de **sucesso**, não deverá ser enviado conteúdo no body da resposta.  
  Em caso de **falha na validação**, a resposta contém um código de status apropriado e um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - Validar os campos obrigatórios: nome, email, senha
  - Validar se o novo e-mail já existe no banco de dados para outro usuário
  - Criptografar a senha antes de salvar no banco de dados
  - Atualizar as informações do usuário no banco de dados

#### **Exemplo de requisição para teste**

```javascript
{
    "nome": "José de Abreu",
    "email": "jose_abreu@email.com",
    "senha": "j4321"
}
```

#### **Exemplos de resposta**

```javascript
// Sem conteúdo no corpo (body) da resposta
```

```javascript
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```

### **Listar categorias**

#### `GET` `/categoria`

Esta rota será chamada quando o usuário logado quiser listar todas as categorias cadastradas.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não deverá possuir conteúdo no body da requisição.

- **Resposta**  
  Em caso de **sucesso**, o body da resposta deverá possuir um array com as categorias encontradas.  
  Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu body deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - O endpoint deverá responder com um array de todas as categorias cadastradas.

#### **Exemplo de requisição para teste**

```javascript
// GET /categoria
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
[
  {
    id: 1,
    descricao: "Roupas",
  },
  {
    id: 2,
    descricao: "Mercado",
  },
];
```

### **Listar transações do usuário logado**

#### `GET` `/transacao`

Esta rota será chamada quando o usuário logado quiser listar todas as suas transações cadastradas.  

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não possui conteúdo no body da requisição.

- **Resposta**  
  Em caso de **sucesso**, o body da resposta possuirá um array das transações encontrados.  
  Em caso de **falha na validação**, a resposta possuirá um objeto com uma propriedade **mensagem** com um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - O usuário será identificado através do ID presente no token de validação,
  - O endpoint responderá com um array de todas as transações associadas ao usuário. Caso não exista nenhuma transação associada ao usuário deverá responder com array vazio.

#### **Exemplo de requisição**

```javascript
// GET /transacao
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
[
  {
    id: 1,
    tipo: "saida",
    descricao: "Sapato amarelo",
    valor: 15800,
    data: "2022-03-23T15:35:00.000Z",
    usuario_id: 5,
    categoria_id: 4,
    categoria_nome: "Roupas",
  },
  {
    id: 3,
    tipo: "entrada",
    descricao: "Salário",
    valor: 300000,
    data: "2022-03-24T15:30:00.000Z",
    usuario_id: 5,
    categoria_id: 6,
    categoria_nome: "Salários",
  },
];
```


### **Detalhar uma transação do usuário logado**

#### `GET` `/transacao/:id`

Esta rota é chamada quando o usuário logado quiser obter uma das suas transações cadastradas.  

- **Requisição**  
Será enviado o ID da transação no parâmetro de rota do endpoint.  
O body da requisição não terá nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, o body da resposta terá um objeto que representa a transação encontrada.  
  Em caso de **falha na validação**, a resposta deverá possuir em seu body um objeto com uma propriedade **mensagem** com um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - Validar se existe transação para o ID enviado como parâmetro na rota e se esta transação pertence ao usuário logado.

#### **Exemplo de requisição para teste**

```javascript
// GET /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
{
    "mensagem": "Transação não encontrada."
}
```

### **Cadastrar transação para o usuário logado**

#### `POST` `/transacao`

Esta rota é utilizada para cadastrar uma transação associada ao usuário logado.  

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O body da requisição possui um objeto com as seguintes propriedades:
  - descricao
  - valor
  - data
  - categoria_id
  - tipo (saída ou entrada de valores)

- **Resposta**
  Em caso de **sucesso**, no body constará as informações da transação cadastrada.  
  Em caso de **falha na validação**, a resposta possuirá um objeto com uma propriedade **mensagem** com um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - Validar os campos obrigatórios: descricao, valor, data, categoria_id, tipo.
  - Validar se existe categoria para o ID enviado no body da requisição.
  - Validar se o tipo enviado no body da requisição corresponde a palavra `entrada` ou `saida`.
  - Cadastrar a transação associada ao usuário logado.

#### **Exemplo de requisição para teste**

```javascript
// POST /transacao
{
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "categoria_id": 6
}
```

#### **Exemplos de resposta**

```javascript
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```

### **Atualizar transação do usuário logado**

#### `PUT` `/transacao/:id`

Rota chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas.  

- **Requisição**  
  Será enviado o ID da transação no parâmetro de rota do endpoint.  
  O body da requisição possuirá um objeto com as seguintes propriedades:
  - descricao
  - valor
  - data
  - categoria_id
  - tipo (saída ou entrada de valores)

- **Resposta**  
  Em caso de **sucesso**, o body será sem conteúdo.  
  Em caso de **falha na validação**, o body possuirá um objeto com uma propriedade **mensagem** com um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - Validar se existe transação para o ID enviado como parâmetro na rota e se esta transação pertence ao usuário logado.
  - Validar os campos obrigatórios: descricao, valor, data, categoria_id, tipo.
  - Validar se existe categoria para o ID enviado no body da requisição.
  - Validar se o tipo enviado no body da requisição corresponde a palavra `entrada` ou `saida`.
  - Atualizar a transação no banco de dados.

#### **Exemplo de requisição para teste**

```javascript
// PUT /transacao/2
{
	"descricao": "Sapato amarelo",
	"valor": 15800,
	"data": "2022-03-23 12:35:00",
	"categoria_id": 4,
	"tipo": "saida"
}
```

#### **Exemplos de resposta**

```javascript
// Sem conteúdo no corpo (body) da resposta
```

```javascript
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```

### **Excluir transação do usuário logado**

#### `DELETE` `/transacao/:id`

Rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.  

- **Requisição**  
  Será enviado o ID da transação no parâmetro de rota do endpoint.  
  O body da requisição não possuirá nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, o body da requisição não possuirá nenhum conteúdo.  
  Em caso de **falha na validação**, a resposta possuirá em seu body um objeto com uma propriedade **mensagem** com valor um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**:
  - Validar se existe transação para o ID enviado como parâmetro na rota e se esta transação pertence ao usuário logado.
  - Excluir a transação no banco de dados.

#### **Exemplo de requisição para teste**

```javascript
// DELETE /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// Sem conteúdo no corpo (body) da resposta
```

```javascript
{
    "mensagem": "Transação não encontrada."
}
```

### **Obter extrato de transações**

#### `GET` `/transacao/extrato`

Rota será chamada quando o usuario logado quiser obter o extrato de todas as suas transações cadastradas.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O body da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, o body responderá com um objeto contendo a soma de todas as transações do tipo `entrada` e a soma de todas as transações do tipo `saida`.  
  Em caso de **falha na validação**, o body possuirá um objeto com uma propriedade **mensagem** com um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**:
  - Em caso de não existir transações do tipo `entrada` cadastradas para o usuário logado, o valor retornado no body da resposta deverá ser 0.
  - Em caso de não existir transações do tipo `saida` cadastradas para o usuário logado, o valor retornado no body da resposta deverá ser 0.

#### **Exemplo de requisição para teste**

```javascript
// DELETE /transacao/extrato
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
{
	"entrada": 300000,
	"saida": 15800
}
```

---

### **Filtrar transações por categoria**
#### `GET` `/transacao` 

Na funcionalidade de listagem de transações do usuário logado, você pode incluir um parâmetro opcional do tipo query chamado filtro para permitir a consulta apenas de transações associadas às categorias informadas.

- **Requisição**  
  Parâmetro opcional do tipo query **filtro**.
  O body da requisição não deve possuir conteúdo.

- **Resposta**  
  Em caso de **sucesso**, o body da resposta deve conter um array dos objetos (transações) encontradas.  
  Em caso de **falha na validação**, a resposta deve ter o status code apropriado, e o body deve conter um objeto com a propriedade mensagem, que explicará o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - O usuário deve ser identificado pelo ID presente no token de validação.
  - O parâmetro opcional do tipo query **filtro**, quando enviado, deve ser sempre um array contendo a descrição de uma ou mais categorias.
  - O endpoint deve responder com um array de todas as transações associadas ao usuário que sejam das categorias passadas no parâmetro query. Se não houver nenhuma transação associada ao usuário, a resposta deve ser um array vazio.

#### **Exemplo de requisição**

```javascript
// GET /transacao?filtro[]=roupas&filtro[]=salários
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
[
  {
    id: 1,
    tipo: "saida",
    descricao: "Sapato amarelo",
    valor: 15800,
    data: "2022-03-23T15:35:00.000Z",
    usuario_id: 5,
    categoria_id: 4,
    categoria_nome: "Roupas",
  },
  {
    id: 3,
    tipo: "entrada",
    descricao: "Salário",
    valor: 300000,
    data: "2022-03-24T15:30:00.000Z",
    usuario_id: 5,
    categoria_id: 6,
    categoria_nome: "Salários",
  },
];
```

# Informações

Este README fornece uma visão abrangente das funcionalidades da API, seus endpoints, requisitos obrigatórios, exemplos de requisições e respostas, além das tecnologias utilizadas. Certifique-se de configurar as variáveis de ambiente no arquivo **.env** e instalar as dependências listadas no arquivo package.json antes de executar a aplicação. A seguir, apresento um guia básico para ajudar na configuração e execução da API.

# Guia de Configuração e Execução

## 1. Instalação de Dependências

Certifique-se de ter o Node.js instalado em seu sistema antes de prosseguir. Clone o repositório e, em seguida, abra o terminal no diretório do projeto e execute o seguinte comando para instalar as dependências:

```
npm install
```

## 2. Configuração do Banco de Dados
```
DB_HOST=seu_host
DB_PORT=sua_porta
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
```

## Configuração do JWT
A autenticação é realizada por meio de tokens JWT. Configure a chave secreta para geração e validação de tokens no arquivo `.env`:

## Execução da Aplicação
Após instalar as dependências e configurar o banco de dados, você pode iniciar a aplicação com o seguinte comando:
```
npm run dev
```
Isso iniciará o servidor localmente, e você poderá acessar a API em http://localhost:3000. Certifique-se de ajustar a porta se necessário.

## Testando a API

Você pode usar ferramentas como Postman ou Insomnina para testar os endpoints da API. Certifique-se de seguir os exemplos fornecidos neste README para realizar requisições adequadas.

Lembre-se de que este é um guia básico, e ajustes adicionais podem ser necessários dependendo do ambiente e requisitos específicos.

Agora, você está pronto para explorar e utilizar a API de Controle Financeiro!

# Feedback e Contribuições
Agradecemos por utilizar a API de Controle Financeiro! Caso tenha alguma sugestão, identificado um problema ou queira contribuir com melhorias, sinta-se à vontade para abrir uma issue no repositório. Estamos abertos a feedbacks e colaborações da comunidade para aprimorar continuamente essa aplicação.

Lembre-se de seguir as melhores práticas de desenvolvimento e respeitar as orientações presentes neste README. Esperamos que a API seja útil para seus projetos de controle financeiro pessoal.

Obrigado por sua participação e contribuição!

Atenciosamente,  
Veronica Bierhals
