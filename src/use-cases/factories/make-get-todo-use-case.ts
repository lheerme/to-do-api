import { NodePgTaskRepository } from '../../repositories/node-pg/node-pg-task-repository.ts'
import { NodePgTodoRepository } from '../../repositories/node-pg/node-pg-todo-repository.ts'
import { GetTodo } from '../get-todo.ts'

export function MakeGetTodoUseCase() {
  const todoRepository = NodePgTodoRepository()
  const taskRepository = NodePgTaskRepository()
  const getTodoUseCase = GetTodo(todoRepository, taskRepository)

  return getTodoUseCase
}
