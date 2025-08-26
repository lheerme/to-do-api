import type { Todo } from '../interfaces/todo.ts'
import type { TodosRepository } from '../repositories/todos-repository.ts'

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
  todosRepository: TodosRepository
): GetUserTodoListReturn {
  async function execute({ userId, page }: GetUserTodoListRequest) {
    const todos = await todosRepository.findByUserId(userId, page)

    return { todos }
  }

  return { execute }
}
