import z from 'zod'

export const editTaskSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
})

export type EditTaskForm = z.infer<typeof editTaskSchema>
