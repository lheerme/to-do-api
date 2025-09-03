import z from 'zod'

export const createTodoSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
})

export type CreateTodoForm = z.infer<typeof createTodoSchema>
