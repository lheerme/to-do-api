import type { FastifyReply, FastifyRequest } from 'fastify'
import { idParamSchema } from '../../schemas/id-param-schema.ts'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { MakeGetTodoUseCase } from '../../use-cases/factories/make-get-todo-use-case.ts'

export async function getTodo(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const { id } = idParamSchema.parse(request.params)

  try {
    const getTodoUseCase = MakeGetTodoUseCase()

    const { todo } = await getTodoUseCase.execute({ id, userId })

    return reply.code(200).send({ data: todo })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.code(error.statusCode).send({ message: error.message })
    }

    throw error
  }
}
