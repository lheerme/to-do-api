import type { Todo } from '../interfaces/todo.ts'

export interface TodosRepository {
  createTodo: (data: Todo) => Promise<Todo>
  editTodoTitle: (data: { title: string; id: string }) => Promise<Todo>
  findByTitleAndUserId: (data: {
    title: string
    userId: string
  }) => Promise<Todo | null>
  findByUserId: (userId: string, page: number) => Promise<Todo[]>
  findById: (id: string) => Promise<Todo | null>
  deleteById: (id: string) => Promise<Todo>
}
