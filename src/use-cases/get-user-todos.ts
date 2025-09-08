import type { Todo } from '../interfaces/todo.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'

export interface GetUserTodosRequest {
  userId: string
  page: number
}

export interface GetUserTodosResponse {
  todos: Todo[]
}

export interface GetUserTodosReturn {
  execute: (data: GetUserTodosRequest) => Promise<GetUserTodosResponse>
}

export function GetUserTodos(
  todoRepository: TodoRepository
): GetUserTodosReturn {
  async function execute({ userId, page }: GetUserTodosRequest) {
    const todos = await todoRepository.findByUserId(userId, page)

    return { todos }
  }

  return { execute }
}
