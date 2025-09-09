import { NodePgTaskRepository } from '../../repositories/node-pg/node-pg-task-repository.ts'
import { CreateTask } from '../create-task.ts'

export function MakeCreateTaskUseCase() {
  const taskRepository = NodePgTaskRepository()
  const createTaskUseCase = CreateTask(taskRepository)

  return createTaskUseCase
}
