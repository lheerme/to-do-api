import type { Todo } from '../interfaces/todo.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'

export interface DeleteTodoRequest {
  id: string
  userId: string
}
export interface DeleteTodoResponse {
  todo: Todo
}

export interface DeleteTodoReturn {
  execute: (data: DeleteTodoRequest) => Promise<DeleteTodoResponse>
}

export function DeleteTodo(todoRepository: TodoRepository): DeleteTodoReturn {
  async function execute({ id, userId }: DeleteTodoRequest) {
    const todoById = await todoRepository.findById(id)
    const doesTodoExists = !!todoById

    if (!doesTodoExists) {
      throw new ResourceNotFoundError()
    }

    if (todoById.user_id !== userId) {
      throw new ResourceNotFoundError()
    }

    const todo = await todoRepository.deleteById(id)

    return { todo }
  }

  return { execute }
}
