import type { Task } from '../interfaces/task.ts'

export interface TaskRepository {
  findByTitleAndTodoId: (data: {
    title: string
    todo_id: string
  }) => Promise<Task | null>
  createTask: (data: Omit<Task, 'created_at'>) => Promise<Task>
  findById: (id: string) => Promise<Task | null>
  toggleCompletion: (data: Pick<Task, 'id' | 'is_completed'>) => Promise<Task>
  editTaskTitle: (data: Pick<Task, 'id' | 'title'>) => Promise<Task>
}
