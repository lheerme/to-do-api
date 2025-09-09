import type { FastifyInstance } from 'fastify'
import { createTask } from './controllers/tasks/create-task.ts'
import { createTodo } from './controllers/todos/create-todo.ts'
import { deleteTodo } from './controllers/todos/delete-todo.ts'
import { editTodo } from './controllers/todos/edit-todo.ts'
import { authenticateUser } from './controllers/users/authenticate-user.ts'
import { createUser } from './controllers/users/create-user.ts'
import { getUser } from './controllers/users/get-user.ts'
import { getUserTodos } from './controllers/users/get-user-todos.ts'
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
  app.put('/todos/:id', { onRequest: [verifyJWT] }, editTodo)
  app.delete('/todos/:id', { onRequest: [verifyJWT] }, deleteTodo)
  app.get('/todos', { onRequest: [verifyJWT] }, getUserTodos)

  // tasks
  app.post('/todos/:id', { onRequest: [verifyJWT] }, createTask)
}
