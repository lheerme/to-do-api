import type { User } from '../interfaces/user.ts'

export interface UsersRepository {
  createUser: (data: User) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
  findById: (id: string) => Promise<User | null>
}
