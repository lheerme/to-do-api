import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryTodoRepository,
  type InMemoryTodoRepositoryReturn,
} from '../repositories/in-memory/in-memory-todo-repository.ts'
import { CreateTodo, type CreateTodoReturn } from './create-todo.ts'
import { TodoAlreadyExistsError } from './errors/todo-already-exists-error.ts'

let todoRepository: InMemoryTodoRepositoryReturn
let sut: CreateTodoReturn

describe('Create todo use case', () => {
  beforeEach(() => {
    todoRepository = InMemoryTodoRepository()
    sut = CreateTodo(todoRepository)
  })

  // TODO: Validar se o user realmente existe.
  it('should be able create todo', async () => {
    const { todo } = await sut.execute({
      title: 'Comprar pão',
      user_id: randomUUID(),
    })

    expect(todo.id).toEqual(expect.any(String))
  })

  it('should not be able to create a todo with same name twice for the same user', async () => {
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

  it('should be able to create a todo with same name for different users.', async () => {
    const title = 'Fire toby'

    const { todo: todo1 } = await sut.execute({
      title,
      user_id: randomUUID(),
    })

    const { todo: todo2 } = await sut.execute({
      title,
      user_id: randomUUID(),
    })

    expect(todo1.title).toBe(todo2.title)
  })
})
