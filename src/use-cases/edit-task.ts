import type { Task } from '../interfaces/task.ts'
import type { TaskRepository } from '../repositories/task-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'
import { TaskAlreadyExistsError } from './errors/task-already-exists-error.ts'

export interface EditTaskRequest {
  id: string
  title: string
  todo_id: string
  user_id: string
}

export interface EditTaskResponse {
  task: Task
}

export interface EditTaskReturn {
  execute: (data: EditTaskRequest) => Promise<EditTaskResponse>
}

export function EditTask(taskRepository: TaskRepository): EditTaskReturn {
  async function execute(data: EditTaskRequest) {
    const { id, title, todo_id, user_id } = data

    const taskById = await taskRepository.findById(id)
    const doesTaskExists = !!taskById

    if (!doesTaskExists) {
      throw new ResourceNotFoundError()
    }

    if (taskById.user_id !== user_id) {
      throw new ResourceNotFoundError()
    }

    const isTitleUsed = !!(await taskRepository.findByTitleAndTodoId({
      title,
      todo_id,
    }))

    if (isTitleUsed) {
      throw new TaskAlreadyExistsError()
    }

    const task = await taskRepository.editTaskTitle({ id, title })

    return { task }
  }

  return { execute }
}
