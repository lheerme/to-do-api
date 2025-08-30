import type { Todo } from '../interfaces/todo.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'

export interface GetUserTodoListRequest {
  userId: string
  page: number
}

export interface GetUserTodoListResponse {
  todos: Todo[]
}

export interface GetUserTodoListReturn {
  execute: (data: GetUserTodoListRequest) => Promise<GetUserTodoListResponse>
}

export function GetUserTodoList(
  todoRepository: TodoRepository
): GetUserTodoListReturn {
  async function execute({ userId, page }: GetUserTodoListRequest) {
    const todos = await todoRepository.findByUserId(userId, page)

    return { todos }
  }

  return { execute }
}
