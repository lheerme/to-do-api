import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { getTodo } from './get-todo.ts'

const mockExecute = vi.fn()
const todoId = 'd127f65f-d86b-4581-adc2-79421dd3109a'

describe('Get todo controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('../../use-cases/factories/make-get-todo-use-case.ts', () => {
      return { MakeGetTodoUseCase: vi.fn(() => ({ execute: mockExecute })) }
    })
  })

  it('should be able to get to-do', async () => {
    mockExecute.mockReturnValue({ todo: { id: todoId } })

    const request = {
      user: {
        sub: 'user-01',
      },
      params: {
        id: todoId,
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await getTodo(request, reply)

    expect(reply.code).toHaveBeenCalledWith(200)
    expect(reply.send).toHaveBeenCalledWith({ data: { id: todoId } })
  })

  it('should handle error with message and status code', async () => {
    mockExecute.mockRejectedValue(new ResourceNotFoundError())

    const request = {
      user: {
        sub: 'user-01',
      },
      params: {
        id: todoId,
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await getTodo(request, reply)

    const { message, statusCode } = new ResourceNotFoundError()

    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })
})
