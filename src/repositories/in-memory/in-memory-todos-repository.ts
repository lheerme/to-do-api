import type { Todo } from '../../interfaces/todo.ts'
import type { TodosRepository } from '../todos-repository.ts'

export interface InMemoryTodosRepositoryReturn extends TodosRepository {}

export function InMemoryTodosRepository(): InMemoryTodosRepositoryReturn {
  const todos: Todo[] = []

  async function createTodo(data: Todo) {
    await todos.push(data)

    return data
  }

  async function findByTitle(title: string, userId: string) {
    const response = await todos.find(
      (todo) => todo.title === title && todo.user_id === userId
    )
    return response ? response : null
  }

  async function findByUserId(userId: string, page: number) {
    const response = await todos.filter((todo) => todo.user_id === userId)
    const paginatedResponse = response.slice((page - 1) * 20, page * 20)

    return paginatedResponse
  }

  return { createTodo, findByTitle, findByUserId }
}
