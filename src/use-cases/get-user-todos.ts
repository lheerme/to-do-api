import type { Todo } from '../interfaces/todo.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'

export interface GetUserTodosRequest {
  userId: string
  page: number
}

export interface GetUserTodosResponse {
  todos: Todo[]
  info: {
    count: number
    total_pages: number
    next: number | null
    prev: number | null
  }
}

export interface GetUserTodosReturn {
  execute: (data: GetUserTodosRequest) => Promise<GetUserTodosResponse>
}

export function GetUserTodos(
  todoRepository: TodoRepository
): GetUserTodosReturn {
  async function execute({ userId, page }: GetUserTodosRequest) {
    const { total_todos } = await todoRepository.countTodosByUserId(userId)
    const totalTodos = Number(total_todos)
    const limit = 10
    const totalPages =
      Math.ceil(totalTodos / limit) < 1 ? 1 : Math.ceil(totalTodos / limit)
    const formattedPage = page <= totalPages ? page : totalPages
    const nextPage = page < totalPages ? page + 1 : null
    const prevPage = formattedPage <= 1 ? null : formattedPage - 1

    const todos = await todoRepository.findByUserId(userId, formattedPage)

    const info = {
      count: totalTodos,
      total_pages: totalPages,
      next: nextPage,
      prev: prevPage,
    }

    return { todos, info }
  }

  return { execute }
}
