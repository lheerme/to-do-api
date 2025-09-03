import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserProfile } from '../../use-cases/factories/make-get-user-profile.ts'

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const getUserUseCase = makeGetUserProfile()

  const user = await getUserUseCase.execute({ id: request.user.sub })

  return reply.code(200).send({ data: user })
}
