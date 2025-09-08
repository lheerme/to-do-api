import type { FastifyReply, FastifyRequest } from 'fastify'
import { editTodoSchema } from '../../schemas/edit-todo-schema.ts'
import { idParamSchema } from '../../schemas/id-param-schema.ts'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error.ts'
import { TodoAlreadyExistsError } from '../../use-cases/errors/todo-already-exists-error.ts'
import { MakeEditTodoUseCase } from '../../use-cases/factories/make-edit-todo-use-case.ts'

export async function editTodo(request: FastifyRequest, reply: FastifyReply) {
  const { id } = idParamSchema.parse(request.params)
  const { title } = editTodoSchema.parse(request.body)
  const user_id = request.user.sub

  try {
    const editTodoUseCase = MakeEditTodoUseCase()

    const { todo } = await editTodoUseCase.execute({ id, title, user_id })

    return reply.code(200).send({ data: todo })
  } catch (error) {
    if (
      error instanceof TodoAlreadyExistsError ||
      error instanceof ResourceNotFoundError
    ) {
      return reply.code(error.statusCode).send({ message: error.message })
    }

    throw error
  }
}
