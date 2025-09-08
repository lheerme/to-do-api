import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTodoRepository } from '../repositories/in-memory/in-memory-todo-repository.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'
import { DeleteTodo, type DeleteTodoReturn } from './delete-todo.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'

let todoRepository: TodoRepository
let sut: DeleteTodoReturn

describe('Delete todo use case', () => {
  beforeEach(async () => {
    todoRepository = InMemoryTodoRepository()
    sut = DeleteTodo(todoRepository)

    await todoRepository.createTodo({
      id: 'id-01',
      title: 'todo-01',
      user_id: 'user-01',
    })

    await todoRepository.createTodo({
      id: 'id-02',
      title: 'todo-02',
      user_id: 'user-01',
    })
  })

  it('should be able to delete todo', async () => {
    const { todo } = await sut.execute({ id: 'id-02', userId: 'user-01' })

    expect(todo.id).toBe('id-02')
  })

  it('should not be able to delete a todo that does not exists', async () => {
    await expect(async () => {
      await sut.execute({ id: 'id-inexistente', userId: 'user-01' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a todo from another user', async () => {
    await expect(async () => {
      await sut.execute({ id: 'id-01', userId: 'user-inexistente' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
