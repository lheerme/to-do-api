import type { FastifyInstance } from 'fastify'
import { authenticateUser } from './controllers/authenticate-user.ts'
import { createTodo } from './controllers/create-todo.ts'
import { createUser } from './controllers/create-user.ts'
import { getUser } from './controllers/get-user.ts'
import { refresh } from './controllers/refresh.ts'
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
