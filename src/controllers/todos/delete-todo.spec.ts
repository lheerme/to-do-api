import { randomUUID } from 'node:crypto'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { makeDeleteTodoUseCase } from '../../use-cases/factories/make-delete-todo-use-case.ts'
import { deleteTodo } from './delete-todo.ts'

const mockExecute = vi.fn()
const id = randomUUID()
const title = 'todo-title'

describe('Delete todo controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('../../use-cases/factories/make-delete-todo-use-case.ts', () => {
      return {
        makeDeleteTodoUseCase: vi.fn(() => ({ execute: mockExecute })),
      }
    })
  })

  it('should be able to delete todo', async () => {
    const request = {
      params: {
        id,
      },
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

    await deleteTodo(request, reply)

    expect(makeDeleteTodoUseCase).toHaveBeenCalled()
    expect(reply.code).toHaveBeenCalledWith(204)
    expect(reply.send).toHaveBeenCalled()
  })

  it('should not be able to delete inexistent todo', async () => {
    const resourceNotFoundError = new ResourceNotFoundError()

    mockExecute.mockRejectedValueOnce(resourceNotFoundError)

    const request = {
      params: {
        id,
      },
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

    await deleteTodo(request, reply)

    const { message, statusCode } = resourceNotFoundError

    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })
})
