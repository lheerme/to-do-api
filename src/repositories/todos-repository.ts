import type { Todo } from '../interfaces/todo.ts'

export interface TodosRepository {
  createTodo: (data: Todo) => Promise<Todo>
  findByTitle: (title: string, userId: string) => Promise<Todo | null>
  findByUserId: (userId: string, page: number) => Promise<Todo[]>
}
