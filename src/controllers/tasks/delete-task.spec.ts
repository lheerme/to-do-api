import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { deleteTask } from './delete-task.ts'

const mockExecute = vi.fn()
const taskId = 'b028e638-0e51-4be1-ad83-305eae447dd0'
const todoId = 'd127f65f-d86b-4581-adc2-79421dd3109a'

describe('Delete task controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('../../use-cases/factories/make-delete-task-use-case.ts', () => {
      return {
        MakeDeleteTaskUseCase: vi.fn(() => ({ execute: mockExecute })),
      }
    })
  })

  it('should be able to delete task', async () => {
    const request = {
      user: {
        sub: 'user-01',
      },
      params: {
        taskId,
        todoId,
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await deleteTask(request, reply)

    expect(reply.code).toHaveBeenCalledWith(204)
    expect(reply.send).toHaveBeenCalled()
  })

  it('should not be able to delete task from another user', async () => {
    mockExecute.mockRejectedValueOnce(new ResourceNotFoundError())

    const request = {
      user: {
        sub: 'user-02',
      },
      params: {
        taskId,
        todoId,
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await deleteTask(request, reply)

    const { message, statusCode } = new ResourceNotFoundError()

    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })
})
