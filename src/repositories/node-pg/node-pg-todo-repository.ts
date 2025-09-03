import { db } from '../../database/connection.ts'
import type { Todo } from '../../interfaces/todo.ts'
import type { TodoRepository } from '../todo-repository.ts'

export function NodePgTodoRepository(): TodoRepository {
  async function createTodo(data: Omit<Todo, 'created_at'>) {
    const { id, title, user_id } = data

    const query =
      'INSERT INTO todos (id, title, user_id) VALUES ($1, $2, $3) RETURNING *'
    const values = [id, title, user_id]

    const todo = await db.query<Todo>(query, values)

    return todo[0]
  }

  async function editTodoTitle(data: { title: string; id: string }) {
    const { id, title } = data

    const query = 'UPDATE todos SET title = $1 WHERE id = $2 RETURNING *'
    const values = [title, id]

    const todo = await db.query<Todo>(query, values)

    return todo[0]
  }

  async function findByTitleAndUserId(data: Pick<Todo, 'title' | 'user_id'>) {
    const { title, user_id } = data

    const query = 'SELECT * FROM todos WHERE title = $1 AND user_id = $2'
    const values = [title, user_id]

    const todo = await db.query<Todo>(query, values)

    return todo.length ? todo[0] : null
  }

  // TODO: Paginação
  async function findByUserId(userId: string, _page: number) {
    const query = 'SELECT * FROM todos WHERE user_id = $1'
    const values = [userId]

    const todos = await db.query<Todo>(query, values)

    return todos
  }

  async function findById(id: string) {
    const query = 'SELECT * FROM todos WHERE id = $1'
    const values = [id]

    const todo = await db.query<Todo>(query, values)

    return todo.length ? todo[0] : null
  }

  async function deleteById(id: string) {
    const query = 'DELETE FROM todos WHERE id = $1'
    const values = [id]

    const todo = await db.query<Todo>(query, values)

    return todo[0]
  }

  return {
    createTodo,
    editTodoTitle,
    findByTitleAndUserId,
    findByUserId,
    findById,
    deleteById,
  }
}
