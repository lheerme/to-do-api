import { randomUUID } from 'node:crypto'
import type { Todo } from '../interfaces/todo.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'
import type { CreateTodoForm } from '../schemas/create-todo-schema.ts'
import { TodoAlreadyExistsError } from './errors/todo-already-exists-error.ts'

export interface CreateTodoRequest extends CreateTodoForm {
  user_id: string
}

export interface CreateTodoResponse {
  todo: Todo
}

export interface CreateTodoReturn {
  execute: (todoData: CreateTodoRequest) => Promise<CreateTodoResponse>
}

export function CreateTodo(todoRepository: TodoRepository): CreateTodoReturn {
  async function execute(
    todoData: CreateTodoRequest
  ): Promise<CreateTodoResponse> {
    const { title, user_id } = todoData
    const isTitleUsed = await todoRepository.findByTitleAndUserId({
      title,
      user_id,
    })

    if (isTitleUsed) {
      throw new TodoAlreadyExistsError()
    }

    const id = randomUUID()

    const todo = await todoRepository.createTodo({
      id,
      title,
      user_id,
    })

    return { todo }
  }

  return { execute }
}
