import { randomUUID } from 'node:crypto'
import type { Todo } from '../interfaces/todo.ts'
import type { TodosRepository } from '../repositories/todos-repository.ts'
import type { CreateTodoForm } from '../schemas/create-todo-schema.ts'
import { TodoAlreadyExistsError } from './errors/todo-already-exists-error.ts'

export interface CreateTodoRequest extends CreateTodoForm {}

export interface CreateTodoResponse {
  todo: Todo
}

export interface CreateTodoReturn {
  execute: (todoData: CreateTodoRequest) => Promise<CreateTodoResponse>
}

export function CreateTodo(todosRepository: TodosRepository): CreateTodoReturn {
  async function execute(
    todoData: CreateTodoRequest
  ): Promise<CreateTodoResponse> {
    const { title, user_id } = todoData
    const isTitleUsed = await todosRepository.findByTitle(title, user_id)

    if (isTitleUsed) {
      throw new TodoAlreadyExistsError()
    }

    const id = randomUUID()
    const created_at = new Date()

    const todo = await todosRepository.createTodo({
      id,
      title,
      created_at,
      tasks_completed: 0,
      total_tasks: 0,
      user_id,
    })

    return { todo }
  }

  return { execute }
}
