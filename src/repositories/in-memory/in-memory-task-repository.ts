import type { Task } from '../../interfaces/task.ts'
import type { TaskRepository } from '../task-repository.ts'

export interface InMemoryTaskRepositoryReturn extends TaskRepository {}

export function InMemoryTaskRepository(): InMemoryTaskRepositoryReturn {
  const tasks: Task[] = []

  async function createTask(data: Omit<Task, 'created_at'>) {
    const created_at = new Date()
    const newTask = { ...data, created_at }

    await tasks.push(newTask)

    return newTask
  }

  async function findByTitleAndTodoId(data: {
    title: string
    todo_id: string
  }) {
    const { title, todo_id } = data
    const response = await tasks.find(
      (task) => task.title === title && task.todo_id === todo_id
    )

    return response ? response : null
  }

  return { createTask, findByTitleAndTodoId }
}
