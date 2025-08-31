import type { Task } from '../interfaces/task.ts'
import type { TaskRepository } from '../repositories/task-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'

export interface ToggleTaskCompletionRequest {
  id: string
  is_completed: boolean
}
export interface ToggleTaskCompletionResponse {
  task: Task
}

export interface ToggleTaskCompletionReturn {
  execute: (
    data: ToggleTaskCompletionRequest
  ) => Promise<ToggleTaskCompletionResponse>
}

export function ToggleTaskCompletion(
  taskRepository: TaskRepository
): ToggleTaskCompletionReturn {
  async function execute(data: ToggleTaskCompletionRequest) {
    const { id, is_completed } = data

    const doesTaskExists = !!(await taskRepository.findById(id))

    if (!doesTaskExists) {
      throw new ResourceNotFoundError()
    }

    const task = await taskRepository.toggleCompletion({ id, is_completed })

    return { task }
  }

  return { execute }
}
