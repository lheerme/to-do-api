import type { FastifyReply, FastifyRequest } from 'fastify'
import { editTaskParamsSchema as toggleTaskCompletionParamsSchema } from '../../schemas/edit-task-params-schema.ts'
import { toggleTaskCompletionSchema } from '../../schemas/toggle-task-completion-schema.ts'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { MakeToggleTaskCompletionUseCase } from '../../use-cases/factories/make-toggle-task-completion-use-case.ts'

export async function toggleTaskCompletion(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user_id = request.user.sub
  const { isCompleted: is_completed } = toggleTaskCompletionSchema.parse(
    request.body
  )
  const { taskId: id } = toggleTaskCompletionParamsSchema.parse(request.params)

  try {
    const toggleTaskCompletionUseCase = MakeToggleTaskCompletionUseCase()

    const { task } = await toggleTaskCompletionUseCase.execute({
      id,
      user_id,
      is_completed,
    })

    return reply.code(200).send({ data: task })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.code(error.statusCode).send({ message: error.message })
    }

    throw error
  }
}
