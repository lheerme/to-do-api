import type { Task } from '../interfaces/task.ts'

export interface TaskRepository {
  findByTitleAndTodoId: (
    data: Pick<Task, 'title' | 'todo_id'>
  ) => Promise<Task | null>
  createTask: (data: Omit<Task, 'created_at'>) => Promise<Task>
  findById: (id: string) => Promise<Task | null>
  findByTodoId: (id: string) => Promise<Task[]>
  toggleCompletion: (data: Pick<Task, 'id' | 'is_completed'>) => Promise<Task>
  editTaskTitle: (data: Pick<Task, 'id' | 'title'>) => Promise<Task>
  deleteById: (id: string) => Promise<Task>
}
