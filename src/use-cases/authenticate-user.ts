import bcrypt from 'bcryptjs'
import type { User } from '../interfaces/user.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.ts'

export interface AuthenticateUserRequest {
  email: string
  password: string
}

export interface AuthenticateUserResponse {
  user: User
}

export interface AuthenticateUserReturn {
  execute: (arg0: AuthenticateUserRequest) => Promise<AuthenticateUserResponse>
}

export function AuthenticateUser(
  usersRepository: UsersRepository
): AuthenticateUserReturn {
  async function execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isCredentialsValid = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!isCredentialsValid) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }

  return { execute }
}
