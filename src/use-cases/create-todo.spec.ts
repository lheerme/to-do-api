import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryTodosRepository,
  type InMemoryTodosRepositoryReturn,
} from '../repositories/in-memory/in-memory-todos-repository.ts'
import { CreateTodo, type CreateTodoReturn } from './create-todo.ts'
import { TodoAlreadyExistsError } from './errors/todo-already-exists-error.ts'

let todosRepository: InMemoryTodosRepositoryReturn
let sut: CreateTodoReturn

describe('Create todo use case', () => {
  beforeEach(() => {
    todosRepository = InMemoryTodosRepository()
    sut = CreateTodo(todosRepository)
  })

  // TODO: Validar se o user realmente existe.
  it('should be able create todo', async () => {
    const { todo } = await sut.execute({
      title: 'Comprar pão',
      user_id: randomUUID(),
    })

    expect(todo.id).toEqual(expect.any(String))
  })

  it('should not be able to create a todo with same name twice', async () => {
    const title = 'Fire toby'
    const user_id = randomUUID()

    await sut.execute({
      title,
      user_id,
    })

    await expect(async () => {
      await sut.execute({
        title,
        user_id,
      })
    }).rejects.toBeInstanceOf(TodoAlreadyExistsError)
  })
})
