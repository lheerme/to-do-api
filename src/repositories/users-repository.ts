import type { User } from '../interfaces/user.ts'

export interface UsersRepository {
  createUser: (data: User) => Promise<{ email: string; id: string } | null>
  isEmailInUse: (email: string) => Promise<boolean>
}
