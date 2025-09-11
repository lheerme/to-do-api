import { NodePgTaskRepository } from '../../repositories/node-pg/node-pg-task-repository.ts'
import { ToggleTaskCompletion } from '../toggle-task-completion.ts'

export function MakeToggleTaskCompletionUseCase() {
  const taskRepository = NodePgTaskRepository()
  const toggleTaskCompletionUseCase = ToggleTaskCompletion(taskRepository)

  return toggleTaskCompletionUseCase
}
