import type { Todo } from '../interfaces/todo.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'
import { TodoAlreadyExistsError } from './errors/todo-already-exists-error.ts'

export interface EditTodoRequest {
  title: string
  id: string
  user_id: string
}
export interface EditTodoResponse {
  todo: Todo
}

export interface EditTodoReturn {
  execute: (data: EditTodoRequest) => Promise<EditTodoResponse>
}

export function EditTodo(todoRepository: TodoRepository): EditTodoReturn {
  async function execute(data: EditTodoRequest) {
    const { id, title, user_id } = data

    const doesTodoExists = !!(await todoRepository.findById(id))
    const isTitleUsed = !!(await todoRepository.findByTitleAndUserId({
      title,
      user_id,
    }))

    if (!doesTodoExists) {
      throw new ResourceNotFoundError()
    }

    if (isTitleUsed) {
      throw new TodoAlreadyExistsError()
    }

    const todo = await todoRepository.editTodoTitle({ id, title })

    return { todo }
  }

  return { execute }
}
