import z from 'zod'

export const authenticateUserSchema = z.object({
  email: z.email(),
  password: z.coerce.string(),
})

export type AuthenticateUser = z.infer<typeof authenticateUserSchema>
