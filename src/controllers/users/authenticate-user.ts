import type { FastifyReply, FastifyRequest } from 'fastify'
import { authenticateUserSchema } from '../../schemas/authenticate-user-schema.ts'
import { InvalidCredentialsError } from '../../use-cases/errors/invalid-credentials-error.ts'
import { MakeAuthenticateUserUseCase } from '../../use-cases/factories/make-authenticate-user-use-case.ts'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = authenticateUserSchema.parse(request.body)
  const authenticateUserUseCase = MakeAuthenticateUserUseCase()

  try {
    const { user } = await authenticateUserUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .code(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.code(error.statusCode).send({ message: error.message })
    }

    throw error
  }
}
