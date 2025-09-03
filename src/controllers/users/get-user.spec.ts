import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { makeGetUserProfile } from '../../use-cases/factories/make-get-user-profile.ts'
import { getUser } from './get-user.ts'

const mockExecute = vi.fn()

describe('Get user controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('../../use-cases/factories/make-get-user-profile.ts', () => {
      return {
        makeGetUserProfile: vi.fn(() => ({ execute: mockExecute })),
      }
    })
  })

  it('should be able to get user', async () => {
    mockExecute.mockReturnValue({ data: { id: 'id-01' } })

    const request = {
      user: {
        sub: 'user-id',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await getUser(request, reply)

    expect(makeGetUserProfile).toHaveBeenCalled()
    expect(reply.code).toHaveBeenCalledWith(200)
    expect(reply.send).toHaveBeenCalledWith({
      data: expect.objectContaining({ data: { id: 'id-01' } }),
    })
  })
})
