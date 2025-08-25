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

  return { createTodo, findByTitle }
}
