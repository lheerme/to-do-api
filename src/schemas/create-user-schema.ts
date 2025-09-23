import z from 'zod'

export const createUserSchema = z.object({
  firstName: z
    .string('The type of the first name must be a string.')
    .min(3, 'First name is required.')
    .max(50, 'First name too long.')
    .trim(),
  lastName: z
    .string('The type of the last name must be a string.')
    .min(1, 'Last name is required.')
    .max(50, 'Last name too long.')
    .trim(),
  email: z.email(),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
})

export type CreateUserForm = z.infer<typeof createUserSchema>
