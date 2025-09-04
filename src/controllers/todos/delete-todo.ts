import type { FastifyReply, FastifyRequest } from 'fastify'
import { idParamSchema } from '../../schemas/id-param-schema.ts'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { makeDeleteTodoUseCase } from '../../use-cases/factories/make-delete-todo-use-case.ts'

export async function deleteTodo(request: FastifyRequest, reply: FastifyReply) {
  const { id } = idParamSchema.parse(request.params)

  try {
    const deleteTodoUseCase = makeDeleteTodoUseCase()

    await deleteTodoUseCase.execute({ id })

    return reply.code(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.code(error.statusCode).send({ message: error.message })
    }

    throw error
  }
}
