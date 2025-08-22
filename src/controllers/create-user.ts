import type { FastifyReply, FastifyRequest } from 'fastify'
import { NodePgUsersRepository } from '../repositories/node-pg/node-pg-users-repository.ts'
import { createUserSchema } from '../schemas/create-user-schema.ts'
import { CreateUserUseCase } from '../use-cases/create-user.ts'
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exists-error.ts'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const data = createUserSchema.parse(request.body)

  try {
    const usersRepository = NodePgUsersRepository()
    const createUserUseCase = CreateUserUseCase(usersRepository)

    await createUserUseCase.execute(data)
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }

    throw error
  }

  return reply.code(201).send()
}
