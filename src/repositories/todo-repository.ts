import type { Todo } from '../interfaces/todo.ts'

export interface TodoRepository {
  createTodo: (data: Omit<Todo, 'created_at'>) => Promise<Todo>
  editTodoTitle: (data: Pick<Todo, 'title' | 'id'>) => Promise<Todo>
  findByTitleAndUserId: (
    data: Pick<Todo, 'title' | 'user_id'>
  ) => Promise<Todo | null>
  findByUserId: (userId: string, page: number) => Promise<Todo[]>
  findById: (id: string) => Promise<Todo | null>
  deleteById: (id: string) => Promise<Todo>
  countTodosByUserId: (userId: string) => Promise<{ total_todos: number }>
}
