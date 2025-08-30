import type { User } from '../../interfaces/user.ts'
import type { UserRepository } from '../user-repository.ts'

export interface InMemoryUserRepositoryResponse extends UserRepository {
  users: User[]
}

export function InMemoryUserRepository(): InMemoryUserRepositoryResponse {
  const users: User[] = []

  async function createUser(data: User) {
    await users.push(data)

    return data
  }

  async function findByEmail(email: string) {
    const response = await users.find((user) => user.email === email)
    return response ? response : null
  }

  async function findById(id: string) {
    const response = await users.find((user) => user.id === id)
    return response ? response : null
  }

  return { createUser, findByEmail, findById, users }
}
