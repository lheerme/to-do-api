import { db } from '../../database/connection.ts'
import type { Task } from '../../interfaces/task.ts'
import type { TaskRepository } from '../task-repository.ts'

export function NodePgTaskRepository(): TaskRepository {
  async function findByTitleAndTodoId(data: Pick<Task, 'title' | 'todo_id'>) {
    const { title, todo_id } = data

    const query = 'SELECT * from tasks WHERE title = $1 AND todo_id = $2;'
    const values = [title, todo_id]

    const response = await db.query<Task>(query, values)

    return response.length ? response[0] : null
  }

  async function createTask(data: Omit<Task, 'created_at'>) {
    const { id, is_completed, title, todo_id, user_id } = data

    const query =
      'INSERT INTO tasks (id, title, is_completed, todo_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;'
    const values = [id, title, String(is_completed), todo_id, user_id]

    const task = await db.query<Task>(query, values)

    return task[0]
  }

  async function findById(id: string) {
    const query = 'SELECT * FROM tasks WHERE id = $1;'
    const values = [id]

    const response = await db.query<Task>(query, values)

    return response.length ? response[0] : null
  }

  async function toggleCompletion(data: Pick<Task, 'id' | 'is_completed'>) {
    const { id, is_completed } = data

    const query = 'UPDATE tasks SET is_completed = $1 WHERE id = $2 RETURNING *'
    const values = [String(is_completed), id]

    const response = await db.query<Task>(query, values)

    return response[0]
  }

  async function editTaskTitle(data: Pick<Task, 'id' | 'title'>) {
    const { id, title } = data

    const query = 'UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *'
    const values = [title, id]

    const response = await db.query<Task>(query, values)

    return response[0]
  }

  async function deleteById(id: string) {
    const query = 'DELETE FROM tasks WHERE id = $1'
    const values = [id]

    const response = await db.query<Task>(query, values)

    return response[0]
  }

  return {
    findByTitleAndTodoId,
    createTask,
    findById,
    toggleCompletion,
    editTaskTitle,
    deleteById,
  }
}
