import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryTodoRepository,
  type InMemoryTodoRepositoryReturn,
} from '../repositories/in-memory/in-memory-todo-repository.ts'
import { GetUserTodos, type GetUserTodosReturn } from './get-user-todos.ts'

let todoRepository: InMemoryTodoRepositoryReturn
let sut: GetUserTodosReturn

describe('get user todos use case', () => {
  beforeEach(() => {
    todoRepository = InMemoryTodoRepository()
    sut = GetUserTodos(todoRepository)
  })

  it('should be able to get user todos', async () => {
    const userId = 'user-01'
    const totalTodos = 3

    for (let i = 0; i < totalTodos; i++) {
      await todoRepository.createTodo({
        id: `todo-${i}`,
        title: `todo-${i}`,
        user_id: userId,
      })
    }

    await todoRepository.createTodo({
      id: 'todo-01',
      title: 'todo-01',
      user_id: 'user-02',
    })

    const { todos } = await sut.execute({ userId, page: 1 })

    expect(todos).toHaveLength(3)
    for (const todo of todos) {
      expect(todo.user_id).toBe(userId)
    }
  })

  it('should be able to return paginated user todos', async () => {
    const userId = 'user-01'

    for (let i = 0; i < 12; i++) {
      await todoRepository.createTodo({
        id: `todo-${i}`,
        title: `todo-${i}`,
        user_id: userId,
      })
    }

    const { todos } = await sut.execute({ userId, page: 2 })

    expect(todos).toEqual([
      expect.objectContaining({ title: 'todo-10' }),
      expect.objectContaining({ title: 'todo-11' }),
    ])
  })
})
