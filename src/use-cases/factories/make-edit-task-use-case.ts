import { NodePgTaskRepository } from '../../repositories/node-pg/node-pg-task-repository.ts'
import { EditTask } from '../edit-task.ts'

export function MakeEditTaskUseCase() {
  const taskRepository = NodePgTaskRepository()
  const editTaskUseCase = EditTask(taskRepository)

  return editTaskUseCase
}
