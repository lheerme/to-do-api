import z from 'zod'

export const editTodoSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  id: z.uuid(),
})

export type EditTodoForm = z.infer<typeof editTodoSchema>
