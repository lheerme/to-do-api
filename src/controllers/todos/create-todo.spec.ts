import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { TodoAlreadyExistsError } from '../../use-cases/errors/todo-already-exists-error.ts'
import { MakeCreateTodoUseCase } from '../../use-cases/factories/make-create-todo-use-case.ts'
import { createTodo } from './create-todo.ts'

const mockExecute = vi.fn()

describe('Create todo controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('../../use-cases/factories/make-create-todo-use-case.ts', () => {
      return {
        MakeCreateTodoUseCase: vi.fn(() => ({ execute: mockExecute })),
      }
    })
  })

  it('should be able to crate todo', async () => {
    const title = 'todo-title'

    mockExecute.mockReturnValue({ todo: { id: 'id-01', title } })

    const request = {
      body: {
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

    await createTodo(request, reply)

    expect(MakeCreateTodoUseCase).toHaveBeenCalled()
    expect(reply.code).toHaveBeenCalledWith(201)
    expect(reply.send).toHaveBeenCalledWith({
      data: expect.objectContaining({ title }),
    })
  })

  it('should not be able to create todo with same title twice', async () => {
    mockExecute.mockRejectedValue(new TodoAlreadyExistsError())

    const request = {
      body: {
        title: 'todo-title',
      },
      user: {
        sub: 'id-01',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await createTodo(request, reply)

    const { message, statusCode } = new TodoAlreadyExistsError()

    expect(MakeCreateTodoUseCase).toHaveBeenCalled()
    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })

  it('should not be able to create todo with an invalid title', async () => {
    const title = ''

    const request = {
      body: {
        title,
      },
      user: {
        sub: 'id-01',
      },
    } as FastifyRequest

    const reply = vi.fn() as unknown as FastifyReply

    await expect(async () => {
      await createTodo(request, reply)
    }).rejects.toBeInstanceOf(ZodError)
  })
})
