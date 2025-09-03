import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import z, { ZodError } from 'zod'
import { authenticateUser } from './controllers/authenticate-user.ts'
import { createUser } from './controllers/create-user.ts'
import { refresh } from './controllers/refresh.ts'
import { env } from './env.ts'

export const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: 10 * 60, // 10min
  },
})

app.post('/users', createUser)
app.post('/sessions', authenticateUser)

app.patch('/token/refresh', refresh)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .code(400)
      .send({ message: 'Validation error.', issues: z.flattenError(error) })
  }

  request.log.error(error)
  return reply.code(500).send({ message: 'Internal Error.' })
})
