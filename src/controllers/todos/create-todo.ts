import type { FastifyReply, FastifyRequest } from 'fastify'
import { createTodoSchema } from '../../schemas/create-todo-schema.ts'
import { TodoAlreadyExistsError } from '../../use-cases/errors/todo-already-exists-error.ts'
import { MakeCreateTodoUseCase } from '../../use-cases/factories/make-create-todo-use-case.ts'

export async function createTodo(request: FastifyRequest, reply: FastifyReply) {
  const data = createTodoSchema.parse(request.body)
  const { title } = data
  const user_id = request.user.sub

  try {
    const createUserUseCase = MakeCreateTodoUseCase()

    const { todo } = await createUserUseCase.execute({ title, user_id })

    return reply.code(201).send({ data: todo })
  } catch (error) {
    if (error instanceof TodoAlreadyExistsError) {
      return reply.code(error.statusCode).send({ message: error.message })
    }

    throw error
  }
}
