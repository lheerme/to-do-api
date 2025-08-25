import z from 'zod'

export const createTodoSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  user_id: z.uuid(),
})

export type CreateTodoForm = z.infer<typeof createTodoSchema>
