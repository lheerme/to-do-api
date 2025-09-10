import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { TaskAlreadyExistsError } from '../../use-cases/errors/task-already-exists-error.ts'
import { editTask } from './edit-task.ts'

const mockExecute = vi.fn()
const taskId = 'b028e638-0e51-4be1-ad83-305eae447dd0'
const todoId = 'd127f65f-d86b-4581-adc2-79421dd3109a'

describe('Create task controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('../../use-cases/factories/make-edit-task-use-case.ts', () => {
      return {
        MakeEditTaskUseCase: vi.fn(() => ({ execute: mockExecute })),
      }
    })
  })

  it('should be able to create task', async () => {
    mockExecute.mockReturnValue({
      task: { id: taskId, title: 'task-title' },
    })

    const request = {
      user: {
        sub: 'user-01',
      },
      params: {
        taskId,
        todoId,
      },
      body: {
        title: 'task-title',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await editTask(request, reply)

    expect(reply.code).toHaveBeenCalledWith(200)
    expect(reply.send).toHaveBeenCalledWith({
      data: expect.objectContaining({ id: taskId, title: 'task-title' }),
    })
  })

  it('should not be able to use a title that already exists', async () => {
    mockExecute.mockRejectedValue(new TaskAlreadyExistsError())

    const request = {
      user: {
        sub: 'user-01',
      },
      params: {
        taskId,
        todoId,
      },
      body: {
        title: 'task-title',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await editTask(request, reply)

    const { message, statusCode } = new TaskAlreadyExistsError()

    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })

  it('should not be able to edit task with an invalid title', async () => {
    const request = {
      user: {
        sub: 'user-01',
      },
      body: {
        title: '',
      },
      params: {
        id: todoId,
      },
    } as FastifyRequest

    const reply = {} as FastifyReply

    await expect(async () => {
      await editTask(request, reply)
    }).rejects.toBeInstanceOf(ZodError)
  })
})
