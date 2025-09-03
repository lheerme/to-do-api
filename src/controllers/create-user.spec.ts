import type { FastifyReply, FastifyRequest } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exists-error.ts'
import { MakeCreateUserUseCase } from '../use-cases/factories/make-create-user-use-case.ts'
import { createUser } from './create-user.ts'

const mockExecute = vi.fn()

describe('Create user controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('../use-cases/factories/make-create-user-use-case.ts', () => {
      return {
        MakeCreateUserUseCase: vi.fn(() => ({
          execute: mockExecute,
        })),
      }
    })
  })

  it('should be able to create user', async () => {
    mockExecute.mockReturnValue({ user: { email: 'teste@teste.com' } })

    const request = {
      body: {
        firstName: 'Michael',
        lastName: 'Scoot',
        email: 'teste@teste.com',
        password: 'teste111',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await createUser(request, reply)

    expect(MakeCreateUserUseCase).toHaveBeenCalled()
    expect(reply.code).toHaveBeenCalledWith(201)
    expect(reply.send).toHaveBeenCalled()
  })

  it('should not be able to create user with same e-mail twice', async () => {
    mockExecute.mockRejectedValue(new UserAlreadyExistsError())

    const request = {
      body: {
        firstName: 'Michael',
        lastName: 'Scoot',
        email: 'teste@teste.com',
        password: 'teste111',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await createUser(request, reply)

    const { statusCode, message } = new UserAlreadyExistsError()

    expect(MakeCreateUserUseCase).toHaveBeenCalled()
    expect(reply.code).toHaveBeenCalledWith(statusCode)
    expect(reply.send).toHaveBeenCalledWith({ message })
  })

  it('should not be able to create user with invalid e-mail', async () => {
    const request = {
      body: {
        firstName: 'Michael',
        lastName: 'Scoot',
        email: 'email_invalido',
        password: 'teste111',
      },
    } as FastifyRequest

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply

    await expect(
      async () => await createUser(request, reply)
    ).rejects.toBeInstanceOf(ZodError)
  })
})
