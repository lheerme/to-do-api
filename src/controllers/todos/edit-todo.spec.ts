import { randomUUID } from 'node:crypto'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { TodoAlreadyExistsError } from '../../use-cases/errors/todo-already-exists-error.ts'
import { MakeEditTodoUseCase } from '../../use-cases/factories/make-edit-todo-use-case.ts'
import { editTodo } from './edit-todo.ts'

const mockExecute = vi.fn()

describe('Edit todo controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('../../use-cases/factories/make-edit-todo-use-case.ts', () => {
      return {
        MakeEditTodoUseCase: vi.fn(() => ({ execute: mockExecute })),
      }
    })
  })

  it('should be able to edit todo', async () => {
    const title = 'todo-title'
    const id = randomUUID()

    mockExecute.mockReturnValue({ todo: { id, title } })

    const request = {
      body: {
        id,
        title,
      },
      user: {
        sub: 'id-01',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await editTodo(request, reply)

    expect(MakeEditTodoUseCase).toHaveBeenCalled()
    expect(reply.code).toHaveBeenCalledWith(200)
    expect(reply.send).toHaveBeenCalledWith({
      data: expect.objectContaining({ title, id }),
    })
  })

  it('should not be able to use a title that already exists', async () => {
    const title = 'todo-title'
    const id = randomUUID()

    mockExecute.mockRejectedValue(new TodoAlreadyExistsError())

    const request = {
      body: {
        id,
        title,
      },
      user: {
        sub: 'id-01',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await editTodo(request, reply)

    const { message, statusCode } = new TodoAlreadyExistsError()

    expect(MakeEditTodoUseCase).toHaveBeenCalled()
    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })

  it('should not be able to edit with an invalid title', async () => {
    const title = ''
    const id = randomUUID()

    const request = {
      body: {
        id,
        title,
      },
      user: {
        sub: 'id-01',
      },
    } as FastifyRequest

    const reply = vi.fn() as unknown as FastifyReply

    await expect(async () => {
      await editTodo(request, reply)
    }).rejects.toBeInstanceOf(ZodError)
  })
})
