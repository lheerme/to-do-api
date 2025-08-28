import type { Todo } from '../interfaces/todo.ts'
import type { TodosRepository } from '../repositories/todos-repository.ts'
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

export function DeleteTodo(todosRepository: TodosRepository): DeleteTodoReturn {
  async function execute({ id }: DeleteTodoRequest) {
    const doesTodoExists = !!(await todosRepository.findById(id))

    if (!doesTodoExists) {
      throw new ResourceNotFoundError()
    }

    const todo = await todosRepository.deleteById(id)

    return { todo }
  }

  return { execute }
}
