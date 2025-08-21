import { app } from './app.ts'
import { env } from './env.ts'

app.listen({ port: env.PORT, host: '0.0.0.0' }, (error) => {
  if (error) {
    // TODO: Utilizar o console.log apenas em desenvolvimento
    console.log(error)
    process.exit(1)
  }

  console.log(`Server listening on ${env.PORT}`)
})
