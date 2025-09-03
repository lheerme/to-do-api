import { NodePgTodoRepository } from '../../repositories/node-pg/node-pg-todo-repository.ts'
import { EditTodo } from '../edit-todo.ts'

export function MakeEditTodoUseCase() {
  const todoRepository = NodePgTodoRepository()
  const editTodoUseCase = EditTodo(todoRepository)

  return editTodoUseCase
}
