import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { toggleTaskCompletion } from './toggle-task-completion.ts'

const mockExecute = vi.fn()
const taskId = 'b028e638-0e51-4be1-ad83-305eae447dd0'
const todoId = 'd127f65f-d86b-4581-adc2-79421dd3109a'

describe('Toggle task completion controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock(
      '../../use-cases/factories/make-toggle-task-completion-use-case.ts',
      () => {
        return {
          MakeToggleTaskCompletionUseCase: vi.fn(() => ({
            execute: mockExecute,
          })),
        }
      }
    )
  })

  it('should be able to toggle task completion', async () => {
    mockExecute.mockReturnValue({
      task: { id: taskId, is_completed: true },
    })

    const request = {
      user: {
        sub: 'user-01',
      },
      body: {
        isCompleted: true,
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

    await toggleTaskCompletion(request, reply)

    expect(reply.code).toHaveBeenCalledWith(200)
    expect(reply.send).toHaveBeenCalledWith({
      data: expect.objectContaining({ id: taskId, is_completed: true }),
    })
  })

  it('should not be able to toggle task completion from another user', async () => {
    mockExecute.mockRejectedValueOnce(new ResourceNotFoundError())

    const request = {
      user: {
        sub: 'user-01',
      },
      body: {
        isCompleted: true,
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

    await toggleTaskCompletion(request, reply)

    const { message, statusCode } = new ResourceNotFoundError()

    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })
})
