import { NodePgTodoRepository } from '../../repositories/node-pg/node-pg-todo-repository.ts'
import { DeleteTodo } from '../delete-todo.ts'

export function makeDeleteTodoUseCase() {
  const todoRepository = NodePgTodoRepository()
  const deleteTodoUseCase = DeleteTodo(todoRepository)

  return deleteTodoUseCase
}
