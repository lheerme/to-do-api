import type { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })

    const accessToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: request.user.sub,
        },
      }
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: request.user.sub,
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
      .send({ accessToken })
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(401).send({ message: error.message })
    }

    throw error
  }
}
