import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTodosRepository } from '../repositories/in-memory/in-memory-todos-repository.ts'
import type { TodosRepository } from '../repositories/todos-repository.ts'
import { DeleteTodo, type DeleteTodoReturn } from './delete-todo.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'

let todosRepository: TodosRepository
let sut: DeleteTodoReturn

describe('Delete todo use case', () => {
  beforeEach(async () => {
    todosRepository = InMemoryTodosRepository()
    sut = DeleteTodo(todosRepository)

    await todosRepository.createTodo({
      created_at: new Date(),
      id: 'id-01',
      title: 'todo-01',
      tasks_completed: 0,
      total_tasks: 0,
      user_id: 'user-01',
    })

    await todosRepository.createTodo({
      created_at: new Date(),
      id: 'id-02',
      title: 'todo-02',
      tasks_completed: 0,
      total_tasks: 0,
      user_id: 'user-01',
    })
  })

  it('should be able to delete todo', async () => {
    const { todo } = await sut.execute({ id: 'id-02' })

    expect(todo.id).toBe('id-02')
  })

  it('should not be able to delete a todo that does not exists', async () => {
    await expect(async () => {
      await sut.execute({ id: 'id-inexistente' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
