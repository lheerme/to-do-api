import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserTodosUseCase } from '../../use-cases/factories/make-get-user-todos-use-case.ts'

export async function getUserTodos(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub

  const getUserTodosUseCase = makeGetUserTodosUseCase()

  // TODO: implementar a paginação
  const { todos } = await getUserTodosUseCase.execute({ userId, page: 1 })

  return reply.code(200).send({ data: todos })
}
