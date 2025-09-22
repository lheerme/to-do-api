import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getUserTodos } from './get-user-todos.ts'

const mockExecute = vi.fn()

describe('Get user todos controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('../../use-cases/factories/make-get-user-todos-use-case.ts', () => {
      return {
        makeGetUserTodosUseCase: vi.fn(() => ({ execute: mockExecute })),
      }
    })
  })

  it('should be able to get user todos', async () => {
    mockExecute.mockReturnValue({
      todos: [{ id: 'todo-01' }, { id: 'todo-02' }],
    })

    const request = {
      user: {
        sub: 'user-01',
      },
      query: {},
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await getUserTodos(request, reply)

    expect(reply.code).toHaveBeenCalledWith(200)
    expect(reply.send).toHaveBeenCalledWith({
      data: [{ id: 'todo-01' }, { id: 'todo-02' }],
    })
  })
})
