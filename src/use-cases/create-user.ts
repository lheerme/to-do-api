import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import type { User } from '../interfaces/user.ts'
import type { UserRepository } from '../repositories/user-repository.ts'
import type { CreateUserForm } from '../schemas/create-user-schema.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.ts'

export interface CreateUserRequest extends CreateUserForm {}
export interface CreateUserResponse {
  user: User
}

export interface CreateUserReturn {
  execute: (user: CreateUserForm) => Promise<CreateUserResponse>
}

export function CreateUser(userRepository: UserRepository): CreateUserReturn {
  async function execute(
    userData: CreateUserForm
  ): Promise<CreateUserResponse> {
    const { firstName, lastName, email, password } = userData
    const isEmailUsed = !!(await userRepository.findByEmail(email))

    if (isEmailUsed) {
      throw new UserAlreadyExistsError()
    }

    const created_at = new Date()
    const password_hash = await bcrypt.hash(password, 6)
    const id = randomUUID()

    const user = await userRepository.createUser({
      id,
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash,
      created_at,
    })

    return { user }
  }

  return { execute }
}
