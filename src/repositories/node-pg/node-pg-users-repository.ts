import { db } from '../../database.ts'
import type { User } from '../../interfaces/user.ts'
import type { UsersRepository } from '../users-repository.ts'

export function NodePgUsersRepository(): UsersRepository {
  async function createUser(
    data: User
  ): Promise<{ email: string; id: string }> {
    const { id, first_name, last_name, email, password_hash } = data

    const query = 'INSERT INTO users VALUES ($1, $2, $3, $4, $5)'
    const values = [id, first_name, last_name, email, password_hash]

    await db.query(query, values)

    return { email, id }
  }

  async function findByEmail(email: string) {
    const response = await db.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    )

    return response.length > 0 ? response[0] : null
  }

  async function findById(id: string) {
    const response = await db.query('SELECT * FROM users WHERE id = $1', [id])

    return response.length > 0 ? response[0] : null
  }

  return { createUser, findByEmail, findById }
}
