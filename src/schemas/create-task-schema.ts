import z from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
})

export type CreateTaskForm = z.infer<typeof createTaskSchema>
