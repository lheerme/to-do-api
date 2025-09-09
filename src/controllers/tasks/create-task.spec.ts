import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { TaskAlreadyExistsError } from '../../use-cases/errors/task-already-exists-error.ts'
import { createTask } from './create-task.ts'

const mockExecute = vi.fn()
const user_id = 'e6335ab1-c5ab-4257-825b-3eb102bfea77'
const todo_id = '9599d2f4-5327-4f13-b084-787ddb1cbf3b'

describe('Create task controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mock('../../use-cases/factories/make-create-task-use-case.ts', () => {
      return {
        MakeCreateTaskUseCase: vi.fn(() => ({ execute: mockExecute })),
      }
    })
  })

  it('should be able to create task', async () => {
    mockExecute.mockReturnValue({ task: { id: 'id-01', title: 'title' } })

    const request = {
      user: {
        sub: user_id,
      },
      body: {
        title: 'title',
      },
      params: {
        id: todo_id,
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await createTask(request, reply)

    expect(reply.code).toHaveBeenCalledWith(201)
    expect(reply.send).toHaveBeenCalledWith({
      data: expect.objectContaining({ title: 'title' }),
    })
  })

  it('should not be able to create task with same title twice', async () => {
    mockExecute.mockRejectedValue(new TaskAlreadyExistsError())

    const request = {
      user: {
        sub: user_id,
      },
      body: {
        title: 'title',
      },
      params: {
        id: todo_id,
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await createTask(request, reply)

    const { statusCode, message } = new TaskAlreadyExistsError()

    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })

  it('should not be able to create task with an invalid title', async () => {
    const request = {
      user: {
        sub: user_id,
      },
      body: {
        title: '',
      },
      params: {
        id: todo_id,
      },
    } as FastifyRequest

    const reply = {} as FastifyReply

    await expect(async () => {
      await createTask(request, reply)
    }).rejects.toBeInstanceOf(ZodError)
  })
})
