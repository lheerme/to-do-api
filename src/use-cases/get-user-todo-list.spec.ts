import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryTodosRepository,
  type InMemoryTodosRepositoryReturn,
} from '../repositories/in-memory/in-memory-todos-repository.ts'
import {
  GetUserTodoList,
  type GetUserTodoListReturn,
} from './get-user-todo-list.ts'

let todosRepository: InMemoryTodosRepositoryReturn
let sut: GetUserTodoListReturn

describe('get user todo use case', () => {
  beforeEach(() => {
    todosRepository = InMemoryTodosRepository()
    sut = GetUserTodoList(todosRepository)
  })

  it('should be able to get user todos', async () => {
    const userId = 'user-01'
    const totalTodos = 3

    for (let i = 0; i < totalTodos; i++) {
      await todosRepository.createTodo({
        id: `todo-${i}`,
        title: `todo-${i}`,
        created_at: new Date(),
        tasks_completed: 0,
        total_tasks: 0,
        user_id: userId,
      })
    }

    await todosRepository.createTodo({
      id: 'todo-01',
      title: 'todo-01',
      created_at: new Date(),
      tasks_completed: 0,
      total_tasks: 0,
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

    for (let i = 0; i < 22; i++) {
      await todosRepository.createTodo({
        id: `todo-${i}`,
        title: `todo-${i}`,
        created_at: new Date(),
        tasks_completed: 0,
        total_tasks: 0,
        user_id: userId,
      })
    }

    const { todos } = await sut.execute({ userId, page: 2 })

    expect(todos).toEqual([
      expect.objectContaining({ title: 'todo-20' }),
      expect.objectContaining({ title: 'todo-21' }),
    ])
  })
})
