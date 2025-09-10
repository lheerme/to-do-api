import type { FastifyReply, FastifyRequest } from 'fastify'
import { editTaskParamsSchema } from '../../schemas/edit-task-params-schema.ts'
import { editTaskSchema } from '../../schemas/edit-task-schema.ts'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { TaskAlreadyExistsError } from '../../use-cases/errors/task-already-exists-error.ts'
import { MakeEditTaskUseCase } from '../../use-cases/factories/make-edit-task-use-case.ts'

export async function editTask(request: FastifyRequest, reply: FastifyReply) {
  const user_id = request.user.sub
  const { taskId: id, todoId: todo_id } = editTaskParamsSchema.parse(
    request.params
  )
  const { title } = editTaskSchema.parse(request.body)

  try {
    const editTaskUseCase = MakeEditTaskUseCase()

    const { task } = await editTaskUseCase.execute({
      id,
      title,
      todo_id,
      user_id,
    })

    return reply.code(200).send({ data: task })
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
