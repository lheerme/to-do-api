import type { Task } from '../interfaces/task.ts'
import type { TaskRepository } from '../repositories/task-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'

export interface DeleteTaskRequest {
  id: string
}
export interface DeleteTaskResponse {
  task: Task
}

export interface DeleteTaskReturn {
  execute: (data: DeleteTaskRequest) => Promise<DeleteTaskResponse>
}

export function DeleteTask(taskRepository: TaskRepository): DeleteTaskReturn {
  async function execute(data: DeleteTaskRequest) {
    const { id } = data

    const doesTaskExists = !!(await taskRepository.findById(id))

    if (!doesTaskExists) {
      throw new ResourceNotFoundError()
    }

    const task = await taskRepository.deleteById(id)

    return { task }
  }

  return { execute }
}
