import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTodosRepository } from '../repositories/in-memory/in-memory-todos-repository.ts'
import type { TodosRepository } from '../repositories/todos-repository.ts'
import { EditTodo, type EditTodoReturn } from './edit-todo.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'
import { TodoAlreadyExistsError } from './errors/todo-already-exists-error.ts'

let todosRepository: TodosRepository
let sut: EditTodoReturn
const todoId = 'todo-01'
const userId = 'user-01'
const newTitle = 'new-title'
const currentTitle = 'current-title'

describe('edit todo use case', () => {
  beforeEach(async () => {
    todosRepository = InMemoryTodosRepository()
    sut = EditTodo(todosRepository)

    await todosRepository.createTodo({
      id: todoId,
      created_at: new Date(),
      title: currentTitle,
      tasks_completed: 0,
      total_tasks: 0,
      user_id: userId,
    })
  })

  it('should be able to edit todo', async () => {
    const { todo } = await sut.execute({
      id: 'todo-01',
      title: newTitle,
      user_id: 'user-01',
    })

    expect(todo.title).toBe(newTitle)
  })

  it('should not be able to edit todo with wrong id', async () => {
    await expect(async () => {
      await sut.execute({
        id: 'todo-02',
        title: newTitle,
        user_id: userId,
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to use a title that already exists with id', async () => {
    await expect(async () => {
      await sut.execute({
        id: todoId,
        title: currentTitle,
        user_id: userId,
      })
    }).rejects.toBeInstanceOf(TodoAlreadyExistsError)
  })
})
