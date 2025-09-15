import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTaskRepository } from '../repositories/in-memory/in-memory-task-repository.ts'
import { InMemoryTodoRepository } from '../repositories/in-memory/in-memory-todo-repository.ts'
import type { TaskRepository } from '../repositories/task-repository.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'
import { GetTodo, type GetTodoReturn } from './get-todo.ts'

let sut: GetTodoReturn
let todoRepository: TodoRepository
let taskRepository: TaskRepository
const userId = 'user-01'
const todoId = 'todo-01'

describe('Get todo use case', () => {
  beforeEach(async () => {
    todoRepository = InMemoryTodoRepository()
    taskRepository = InMemoryTaskRepository()
    sut = GetTodo(todoRepository, taskRepository)

    await todoRepository.createTodo({
      id: todoId,
      title: 'todo-title-01',
      user_id: userId,
    })

    await taskRepository.createTask({
      id: 'task-01',
      is_completed: false,
      title: 'task-title-01',
      todo_id: todoId,
      user_id: userId,
    })

    await taskRepository.createTask({
      id: 'task-02',
      is_completed: false,
      title: 'task-title-02',
      todo_id: todoId,
      user_id: userId,
    })
  })

  it('should be able to get todo with tasks', async () => {
    const { todo } = await sut.execute({ id: todoId, userId })

    expect(todo.tasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: userId,
          todo_id: todoId,
        }),
      ])
    )
  })

  it('should not be able to get inexistent todo', async () => {
    await expect(async () => {
      await sut.execute({ id: 'todo-id', userId })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get todo from another user', async () => {
    await expect(async () => {
      await sut.execute({ id: todoId, userId: 'user-02' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
