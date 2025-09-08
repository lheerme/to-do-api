import { NodePgTodoRepository } from '../../repositories/node-pg/node-pg-todo-repository.ts'
import { GetUserTodos } from '../get-user-todos.ts'

export function makeGetUserTodosUseCase() {
  const todosRepository = NodePgTodoRepository()
  const getUserTodosUseCase = GetUserTodos(todosRepository)

  return getUserTodosUseCase
}
