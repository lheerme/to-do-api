import type { FastifyReply, FastifyRequest } from 'fastify'
import { authenticateUserSchema } from '../schemas/authenticate-user-schema.ts'
import { InvalidCredentialsError } from '../use-cases/errors/invalid-credentials-error.ts'
import { MakeAuthenticateUserUseCase } from '../use-cases/factories/make-authenticate-user-use-case.ts'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = authenticateUserSchema.parse(request.body)
  const authenticateUserUseCase = MakeAuthenticateUserUseCase()

  try {
    await authenticateUserUseCase.execute({ email, password })
    return reply.code(200).send()
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }

    throw error
  }
}
