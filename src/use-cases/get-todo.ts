import type { Task } from '../interfaces/task.ts'
import type { Todo } from '../interfaces/todo.ts'
import type { TaskRepository } from '../repositories/task-repository.ts'
import type { TodoRepository } from '../repositories/todo-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'

export interface GetTodoRequest {
  id: string
  userId: string
}

interface GetTodoResponse {
  todo: Todo & {
    tasks: Task[]
  }
}

export interface GetTodoReturn {
  execute: (data: GetTodoRequest) => Promise<GetTodoResponse>
}

export function GetTodo(
  todoRepository: TodoRepository,
  taskRepository: TaskRepository
): GetTodoReturn {
  async function execute(data: GetTodoRequest) {
    const { id, userId } = data

    const todo = await todoRepository.findById(id)

    if (!todo) {
      throw new ResourceNotFoundError()
    }

    if (todo.user_id !== userId) {
      throw new ResourceNotFoundError()
    }

    const tasks = await taskRepository.findByTodoId(todo.id)

    return { todo: { ...todo, tasks } }
  }

  return { execute }
}
