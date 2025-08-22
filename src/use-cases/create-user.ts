import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import type { UsersRepository } from '../repositories/users-repository.ts'
import type { CreateUserForm } from '../schemas/create-user-schema.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.ts'

export interface CreateUserUseCaseResponse {
  execute: (user: CreateUserForm) => void
}

export function CreateUserUseCase(
  usersRepository: UsersRepository
): CreateUserUseCaseResponse {
  async function execute(user: CreateUserForm) {
    const { firstName, lastName, email, password } = user
    const isEmailUsed = await usersRepository.isEmailInUse(email)

    if (isEmailUsed) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await bcrypt.hash(password, 6)
    const id = randomUUID()

    await usersRepository.createUser({
      id,
      firstName,
      lastName,
      email,
      password_hash,
    })
  }

  return { execute }
}
