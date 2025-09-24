import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeGetUserTodosUseCase } from '../../use-cases/factories/make-get-user-todos-use-case.ts'

export async function getUserTodos(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub
  const requestQuerySchema = z.object({
    page: z.coerce.number().default(1).catch(1),
  })

  const { page } = requestQuerySchema.parse(request.query)
  console.log(Number.isNaN(page) ? 1 : page)

  const getUserTodosUseCase = makeGetUserTodosUseCase()
  const { todos, info } = await getUserTodosUseCase.execute({
    userId,
    page: Number.isNaN(page) ? 1 : page,
  })

  return reply.code(200).send({ info, data: todos })
}
