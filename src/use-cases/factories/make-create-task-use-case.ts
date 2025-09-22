import { NodePgTaskRepository } from '../../repositories/node-pg/node-pg-task-repository.ts'
import { NodePgTodoRepository } from '../../repositories/node-pg/node-pg-todo-repository.ts'
import { CreateTask } from '../create-task.ts'

export function MakeCreateTaskUseCase() {
  const todoRepository = NodePgTodoRepository()
  const taskRepository = NodePgTaskRepository()
  const createTaskUseCase = CreateTask(taskRepository, todoRepository)

  return createTaskUseCase
}
