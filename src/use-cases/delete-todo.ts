import type { Todo } from '../interfaces/todo.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'

export interface DeleteTodoRequest {
  id: string
}
export interface DeleteTodoResponse {
  todo: Todo
}

export interface DeleteTodoReturn {
  execute: (data: DeleteTodoRequest) => Promise<DeleteTodoResponse>
}

export function DeleteTodo(todoRepository: TodoRepository): DeleteTodoReturn {
  async function execute({ id }: DeleteTodoRequest) {
    const doesTodoExists = !!(await todoRepository.findById(id))

    if (!doesTodoExists) {
      throw new ResourceNotFoundError()
    }

    const todo = await todoRepository.deleteById(id)

    return { todo }
  }

  return { execute }
}
