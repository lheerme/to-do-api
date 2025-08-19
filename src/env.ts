import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().min(1024).default(8080),
  DATABASE_URL: z.url(),
})

export const env = envSchema.parse
(process.env)