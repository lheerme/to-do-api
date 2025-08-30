import { randomUUID } from 'node:crypto'
import type { Task } from '../interfaces/task.ts'
import type { TaskRepository } from '../repositories/task-repository.ts'
import type { CreateTaskForm } from '../schemas/create-task-schema.ts'
import { TaskAlreadyExistsError } from './errors/task-already-exists-error.ts'

export interface CreateTaskRequest extends CreateTaskForm {
  user_id: string
  todo_id: string
}
export interface CreateTaskResponse {
  task: Task
}
export interface CreateTaskReturn {
  execute: (data: CreateTaskRequest) => Promise<CreateTaskResponse>
}

export function CreateTask(taskRepository: TaskRepository): CreateTaskReturn {
  async function execute(data: CreateTaskRequest) {
    const { title, user_id, todo_id } = data

    const isTitleUsed = !!(await taskRepository.findByTitleAndTodoId({
      title,
      todo_id,
    }))

    if (isTitleUsed) {
      throw new TaskAlreadyExistsError()
    }

    const id = randomUUID()

    // TODO: checar se o todo existe.
    const task = await taskRepository.createTask({
      id,
      title,
      is_completed: false,
      todo_id,
      user_id,
    })

    return { task }
  }

  return { execute }
}
