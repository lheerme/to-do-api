import type { FastifyReply, FastifyRequest } from 'fastify'
import { editTaskParamsSchema as deleteTaskParamsSchema } from '../../schemas/edit-task-params-schema.ts'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { MakeDeleteTaskUseCase } from '../../use-cases/factories/make-delete-task-use-case.ts'

export async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const { taskId: id } = deleteTaskParamsSchema.parse(request.params)

  try {
    const deleteTaskUseCase = MakeDeleteTaskUseCase()

    await deleteTaskUseCase.execute({
      id,
      userId,
    })

    return reply.code(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.code(error.statusCode).send({ message: error.message })
    }

    throw error
  }
}
