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

  async function findById(id: string) {
    const response = await tasks.find((task) => task.id === id)

    return response ? response : null
  }

  async function toggleCompletion(data: Pick<Task, 'id' | 'is_completed'>) {
    const { id, is_completed } = data
    const taskIndex = await tasks.findIndex((task) => task.id === id)
    await tasks.splice(taskIndex, 1, {
      ...tasks[taskIndex],
      is_completed,
    })

    return tasks[taskIndex]
  }

  async function editTaskTitle(data: Pick<Task, 'id' | 'title'>) {
    const { title, id } = data

    const taskIndex = await tasks.findIndex((task) => task.id === id)
    tasks.splice(taskIndex, 1, { ...tasks[taskIndex], title })

    return tasks[taskIndex]
  }

  return {
    createTask,
    findByTitleAndTodoId,
    findById,
    toggleCompletion,
    editTaskTitle,
  }
}
