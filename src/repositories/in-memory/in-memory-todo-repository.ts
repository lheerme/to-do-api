import type { Todo } from '../../interfaces/todo.ts'
import type { TodoRepository } from '../todo-repository.ts'

export interface InMemoryTodoRepositoryReturn extends TodoRepository {}

export function InMemoryTodoRepository(): InMemoryTodoRepositoryReturn {
  const todos: Todo[] = []

  async function createTodo(data: Omit<Todo, 'created_at'>) {
    const created_at = new Date()
    await todos.push({ ...data, created_at })

    return { ...data, created_at }
  }

  async function findByTitleAndUserId(data: Pick<Todo, 'title' | 'user_id'>) {
    const { title, user_id } = data

    const response = await todos.find(
      (todo) => todo.title === title && todo.user_id === user_id
    )
    return response ? response : null
  }

  async function findByUserId(userId: string, page: number) {
    const limit = 10
    const offset = (page - 1) * limit

    const response = await todos.filter((todo) => todo.user_id === userId)
    const paginatedResponse = response.slice(offset, page * limit)

    return paginatedResponse
  }

  async function findById(id: string) {
    const response = await todos.find((todo) => todo.id === id)

    return response ? response : null
  }

  async function editTodoTitle({ id, title }: { title: string; id: string }) {
    const todoIndex = await todos.findIndex((todo) => todo.id === id)
    todos[todoIndex].title = title
    const response = await todos.find((todo) => todo.id === id)

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return response!
  }

  async function deleteById(id: string) {
    const todoIndex = await todos.findIndex((todo) => todo.id === id)
    const deletedTodo = await todos.splice(todoIndex, 1)

    return deletedTodo[0]
  }

  async function countTodosByUserId(userId: string) {
    const todosByUserId = await todos.filter((todo) => todo.user_id === userId)
    const total_todos = todosByUserId.length

    return { total_todos }
  }

  return {
    countTodosByUserId,
    createTodo,
    editTodoTitle,
    findByTitleAndUserId,
    findByUserId,
    findById,
    deleteById,
  }
}
