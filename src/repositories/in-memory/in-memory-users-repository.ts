import type { User } from '../../interfaces/user.ts'
import type { UsersRepository } from '../users-repository.ts'

export interface InMemoryUsersRepositoryResponse extends UsersRepository {
  users: User[]
}

export function InMemoryUsersRepository(): InMemoryUsersRepositoryResponse {
  const users: User[] = []

  async function createUser(
    data: User
  ): Promise<{ email: string; id: string }> {
    await users.push(data)

    const { email, id } = data

    return { email, id }
  }

  async function findByEmail(email: string) {
    const response = await users.find((user) => user.email === email)
    return response ? response : null
  }

  return { createUser, findByEmail, users }
}
