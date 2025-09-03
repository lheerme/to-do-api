import { NodePgTodoRepository } from '../../repositories/node-pg/node-pg-todo-repository.ts'
import { CreateTodo } from '../create-todo.ts'

export function MakeCreateTodoUseCase() {
  const todoRepository = NodePgTodoRepository()
  const createTodoUseCase = CreateTodo(todoRepository)

  return createTodoUseCase
}
