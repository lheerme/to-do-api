import z from 'zod'

export const editTaskParamsSchema = z.object({
  todoId: z.uuid(),
  taskId: z.uuid(),
})

export type EditTaskParamSchema = z.infer<typeof editTaskParamsSchema>
