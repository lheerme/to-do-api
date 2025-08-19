import fastify from 'fastify'

const app = fastify()

app.get('/', (_request, reply) => {
  return reply.send({ data: 'hello world!' })
})

app.listen({ port: 8080, host: '0.0.0.0' }, (error) => {
  if (error) {
    console.log(error)
    process.exit(1)
  }

  console.log('Server listening on 8080')
})
