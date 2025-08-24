import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryUsersRepository,
  type InMemoryUsersRepositoryResponse,
} from '../repositories/in-memory/in-memory-users-repository.ts'
import {
  AuthenticateUser,
  type AuthenticateUserReturn,
} from './authenticate-user.ts'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.ts'

let usersRepository: InMemoryUsersRepositoryResponse
let sut: AuthenticateUserReturn

describe('Authenticate user use case', () => {
  beforeEach(() => {
    usersRepository = InMemoryUsersRepository()
    sut = AuthenticateUser(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'ilovepaper@email.com'
    const password = 'ihatetoby'

    const created_at = new Date()
    const password_hash = bcrypt.hashSync(password, 6)
    const id = randomUUID()

    await usersRepository.createUser({
      id,
      first_name: 'Michael',
      last_name: 'Scott',
      email,
      password_hash,
      created_at,
    })

    const response = await sut.execute({
      email,
      password,
    })

    expect(response.user.email).toBe(email)
  })

  it('should not be able to authenticate with wrong e-mail', async () => {
    const email = 'ilovepaper@email.com'
    const password = 'ihatetoby'

    await expect(async () => {
      await sut.execute({
        email,
        password,
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const email = 'ilovepaper@email.com'
    const password = 'ihatetoby'

    const created_at = new Date()
    const password_hash = bcrypt.hashSync(password, 6)
    const id = randomUUID()

    await usersRepository.createUser({
      id,
      first_name: 'Michael',
      last_name: 'Scott',
      email,
      password_hash,
      created_at,
    })

    console.log(usersRepository.users)

    await expect(async () => {
      await sut.execute({
        email,
        password: 'ilovetoby',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
