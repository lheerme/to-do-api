import fastify from 'fastify'
import z, { ZodError } from 'zod'
import { authenticateUser } from './controllers/authenticate-user.ts'
import { createUser } from './controllers/create-user.ts'

export const app = fastify()

app.post('/users', createUser)
app.post('/sessions', authenticateUser)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .code(400)
      .send({ message: 'Validation error.', issues: z.flattenError(error) })
  }

  // TODO: Utilizar o console.log apenas em desenvolvimento
  console.log(error)
  return reply.code(500).send({ message: 'Internal Error.' })
})
