import type { User } from '../interfaces/user.ts'

export interface UsersRepository {
  createUser: (data: User) => Promise<{ email: string; id: string } | null>
  findByEmail: (email: string) => Promise<User | null>
}
