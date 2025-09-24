# to-do API

Esta é uma aplicação de **to-do list** construída com **Node.js** utilizando o framework **Fastify**, **PostgreSQL** para persistência de dados, e **Docker** para facilitar o setup e a execução do ambiente de desenvolvimento. A aplicação inclui também integração com **Swagger** para documentação da API e validação de entrada com **Zod**.

A validação de usuário é realizada utilizando **JWT** (JSON Web Tokens), com **access token** para autenticação e **refresh token** para manutenção da sessão do usuário.

Os testes unitários foram implementados utilizando o framework **Vitest**, cobrindo os **Use Cases** e **Controllers** da aplicação.

## Funcionalidades

- Criação, leitura, atualização e exclusão de to-dos e tasks.
- Validação de dados de entrada usando Zod.
- Autenticação de usuários via JWT (access token e refresh token).
- Documentação da API via Swagger.
- Testes unitários para os casos de uso e controllers.
- Persistência de dados com PostgreSQL.
- Execução via Docker para facilitar o ambiente de desenvolvimento.

## Tecnologias Utilizadas

- **Node.js** - Plataforma para execução do JavaScript no servidor.
- **Fastify** - Framework web rápido e eficiente para Node.js.
- **PostgreSQL** - Banco de dados relacional para persistência de dados.
- **Docker** - Contêineres para facilitar o desenvolvimento e execução.
- **Zod** - Biblioteca de validação de dados.
- **Swagger** - Ferramenta para documentação da API.
- **JWT (JSON Web Token)** - Sistema de autenticação com tokens (access token e refresh token).
- **Vitest** - Framework de testes unitários para JavaScript/TypeScript.

## Setup e Execução

### Utilizando Docker

#### 1. Clone o repositório.

```
git clone https://github.com/lheerme/todo-app.git
cd todo-app
```

#### 2. Configure as variaveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=8080
DATABASE_URL=postgres://local_user:password@database:5432/to_do
JWT_SECRET=devenvironment
```

#### 3. Suba os contêiners do Docker:

```
docker-compose up -d
```

#### 4. Use a aplicação

A documentação da aplicação pode ser encontrada em: `http://localhost:8080/docs`

## Testes

Os testes unitários foram implementados com Vitest e cobrem as seguintes áreas:

- Use Cases: Testes para validar a lógica de negócios.
- Controllers: Testes para garantir que a lógica de controle funcione como esperado.

#### Para rodar os testes após a execução do projeto, execute o comando:

```
docker compose exec app npm run test
```

#### Para ver a cobertura de testes, execute:

```
docker compose exec app npm run test:coverage
```

## Endpoints

- `POST /users` - Criação de usuário.
- `POST /sessions` - Autoriza do usuário.
- `PATCH /token/refresh` - Gera um novo access token utilizando o refresh token.
- `GET /user` - Retorna informações do usuário autorizado.
- `POST /todos` - Cria um novo to-do.
- `PUT /todos/:id` - Edita o to-do.
- `DELETE /todos/:id` - Deleta o to-do.
- `GET /todos` - Lista os to-dos.
- `GET /todos/:id` - Lista informações de um to-do específico.
- `POST /todos/:id` - Cria uma nova task para o to-do.
- `PUT /todos/:todoId/tasks/:taskId` - Edita a task.
- `DELETE /todos/:todoId/tasks/:taskId` - Deleta a task.
- `PATCH /todos/:todoId/tasks/:taskId` - Faz o toggle do estado de conclusão da task.
