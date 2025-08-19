import fastify from 'fastify'
import { db } from './database.js'
import { env } from './env.js'

const app = fastify()

app.get('/', async (_request, reply) => {
  const data = await db.query('SELECT $1::text as message', ['hello world'])

  return reply.send(data)
})

app.listen({ port: env.PORT, host: '0.0.0.0' }, (error) => {
  if (error) {
    console.log(error)
    process.exit(1)
  }

  console.log(`Server listening on ${env.PORT}`)
})
