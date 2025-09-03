import type { FastifyInstance } from 'fastify'
import { createTodo } from './controllers/todos/create-todo.ts'
import { authenticateUser } from './controllers/users/authenticate-user.ts'
import { createUser } from './controllers/users/create-user.ts'
import { getUser } from './controllers/users/get-user.ts'
import { refresh } from './controllers/users/refresh.ts'
import { verifyJWT } from './middlewares/verify-jwt.ts'

export function routes(app: FastifyInstance) {
  // user
  app.post('/users', createUser)
  app.post('/sessions', authenticateUser)
  app.patch('/token/refresh', refresh)
  app.get('/user', { onRequest: [verifyJWT] }, getUser)

  // to-dos
  app.post('/todos', { onRequest: [verifyJWT] }, createTodo)
}
