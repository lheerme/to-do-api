import { beforeEach } from 'node:test'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { describe, expect, it, vi } from 'vitest'
import { InvalidCredentialsError } from '../../use-cases/errors/invalid-credentials-error.ts'
import { MakeAuthenticateUserUseCase } from '../../use-cases/factories/make-authenticate-user-use-case.ts'
import { authenticateUser } from './authenticate-user.ts'

const mockExecute = vi.fn()

describe('Authenticate user controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock(
      '../../use-cases/factories/make-authenticate-user-use-case.ts',
      () => {
        return {
          MakeAuthenticateUserUseCase: vi.fn(() => ({
            execute: mockExecute,
          })),
        }
      }
    )
  })

  it('should be able to authenticate user', async () => {
    mockExecute.mockReturnValue({ user: { id: 'id-01' } })

    const request = {
      body: {
        email: 'teste@teste.com',
        password: 'teste111',
      },
    } as FastifyRequest

    const reply = {
      jwtSign: vi.fn().mockReturnValue('jwt-secret'),
      setCookie: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await authenticateUser(request, reply)

    expect(MakeAuthenticateUserUseCase).toHaveBeenCalled()
    expect(reply.setCookie).toHaveBeenCalledWith(
      'refreshToken',
      'jwt-secret',
      expect.objectContaining({ httpOnly: true })
    )
    expect(reply.code).toHaveBeenCalledWith(200)
    expect(reply.send).toHaveBeenCalledWith({ token: expect.any(String) })
  })

  it('should return unauthorized for wrong credentials', async () => {
    mockExecute.mockRejectedValue(new InvalidCredentialsError())

    const request = {
      body: {
        email: 'teste@teste.com',
        password: 'wrong_password',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await authenticateUser(request, reply)

    const { message, statusCode } = new InvalidCredentialsError()

    expect(MakeAuthenticateUserUseCase).toHaveBeenCalled()
    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })
})
