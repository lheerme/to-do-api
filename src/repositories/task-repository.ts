import type { Task } from '../interfaces/task.ts'

export interface TaskRepository {
  findByTitleAndTodoId: (data: {
    title: string
    todo_id: string
  }) => Promise<Task | null>
  createTask: (data: Omit<Task, 'created_at'>) => Promise<Task>
}
