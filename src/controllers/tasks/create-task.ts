import type { FastifyReply, FastifyRequest } from 'fastify'
import { createTaskSchema } from '../../schemas/create-task-schema.ts'
import { idParamSchema } from '../../schemas/id-param-schema.ts'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { TaskAlreadyExistsError } from '../../use-cases/errors/task-already-exists-error.ts'
import { MakeCreateTaskUseCase } from '../../use-cases/factories/make-create-task-use-case.ts'

export async function createTask(request: FastifyRequest, reply: FastifyReply) {
  const { title } = createTaskSchema.parse(request.body)
  const { id: todo_id } = idParamSchema.parse(request.params)
  const user_id = request.user.sub

  try {
    const createTaskUseCase = MakeCreateTaskUseCase()

    const { task } = await createTaskUseCase.execute({
      title,
      todo_id,
      user_id,
    })

    return reply.code(201).send({ data: task })
  } catch (error) {
    if (
      error instanceof TaskAlreadyExistsError ||
      error instanceof ResourceNotFoundError
    ) {
      return reply.code(error.statusCode).send({ message: error.message })
    }

    throw error
  }
}
