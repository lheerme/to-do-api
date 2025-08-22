import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import type { UsersRepository } from '../repositories/users-repository.ts'
import type { CreateUserForm } from '../schemas/create-user-schema.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.ts'

export interface CreateUserResponse {
  execute: (user: CreateUserForm) => Promise<void>
}

export function CreateUser(
  usersRepository: UsersRepository
): CreateUserResponse {
  async function execute(user: CreateUserForm) {
    const { firstName, lastName, email, password } = user
    const isEmailUsed = !!(await usersRepository.findByEmail(email))

    if (isEmailUsed) {
      throw new UserAlreadyExistsError()
    }

    const created_at = new Date()
    const password_hash = await bcrypt.hash(password, 6)
    const id = randomUUID()

    await usersRepository.createUser({
      id,
      firstName,
      lastName,
      email,
      password_hash,
      created_at,
    })
  }

  return { execute }
}
