import fastify from 'fastify'
import { env } from './env.js'

const app = fastify()

app.get('/', (_request, reply) => {
  return reply.send({ data: 'hello world!' })
})

app.listen({ port: env.PORT, host: '0.0.0.0' }, (error) => {
  if (error) {
    console.log(error)
    process.exit(1)
  }

  console.log(`Server listening on ${env.PORT}`)
})
