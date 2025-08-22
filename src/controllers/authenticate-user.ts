import type { FastifyReply, FastifyRequest } from 'fastify'
import { NodePgUsersRepository } from '../repositories/node-pg/node-pg-users-repository.ts'
import { authenticateUserSchema } from '../schemas/authenticate-user-schema.ts'
import { AuthenticateUser } from '../use-cases/authenticate-user.ts'
import { InvalidCredentialsError } from '../use-cases/errors/invalid-credentials-error.ts'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = authenticateUserSchema.parse(request.body)
  const usersRepository = NodePgUsersRepository()
  const authenticateUserUseCase = AuthenticateUser(usersRepository)

  try {
    await authenticateUserUseCase.execute({ email, password })
    return reply.code(200).send()
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }
  }
}
