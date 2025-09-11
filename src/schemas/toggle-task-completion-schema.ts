import z from 'zod'

export const toggleTaskCompletionSchema = z.object({
  isCompleted: z.boolean(),
})

export type toggleTaskCompletionForm = z.infer<
  typeof toggleTaskCompletionSchema
>
