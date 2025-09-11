import { NodePgTaskRepository } from '../../repositories/node-pg/node-pg-task-repository.ts'
import { DeleteTask } from '../delete-task.ts'

export function MakeDeleteTaskUseCase() {
  const taskRepository = NodePgTaskRepository()
  const deleteTaskUseCase = DeleteTask(taskRepository)

  return deleteTaskUseCase
}
