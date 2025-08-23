import type { FastifyReply, FastifyRequest } from 'fastify'
import { createUserSchema } from '../schemas/create-user-schema.ts'
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exists-error.ts'
import { MakeCreateUserUseCase } from '../use-cases/factories/make-create-user-use-case.ts'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const data = createUserSchema.parse(request.body)

  try {
    const createUserUseCase = MakeCreateUserUseCase()

    await createUserUseCase.execute(data)
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }

    throw error
  }

  return reply.code(201).send()
}
