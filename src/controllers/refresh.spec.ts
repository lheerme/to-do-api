import { beforeEach } from 'node:test'
import type { FastifyJWTOptions } from '@fastify/jwt'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { describe, expect, it, vi } from 'vitest'
import { refresh } from './refresh.ts'

describe('Refresh controller', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should be able to refresh user token', async () => {
    const request = {
      jwtVerify: vi.fn(),
      user: {
        sub: 'id-01',
      },
    } as unknown as FastifyRequest & FastifyJWTOptions

    const reply = {
      setCookie: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
      jwtSign: vi.fn().mockReturnValue('jwt-secret'),
    } as unknown as FastifyReply & FastifyJWTOptions

    await refresh(request, reply)

    expect(reply.setCookie).toHaveBeenCalledWith(
      'refreshToken',
      'jwt-secret',
      expect.objectContaining({ httpOnly: true })
    )
    expect(reply.code).toHaveBeenCalledWith(200)
    expect(reply.send).toHaveBeenCalledWith({ accessToken: 'jwt-secret' })
  })

  it('should not be able to refresh user token without cookie', async () => {
    const request = {
      jwtVerify: vi.fn().mockRejectedValue(new Error('Unauthorized')),
      user: {
        sub: 'id-01',
      },
    } as unknown as FastifyRequest & FastifyJWTOptions

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply & FastifyJWTOptions

    await refresh(request, reply)

    expect(reply.code).toHaveBeenCalledWith(401)
    expect(reply.send).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })
})
