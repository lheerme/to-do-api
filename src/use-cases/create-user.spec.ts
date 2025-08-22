import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryUsersRepository,
  type InMemoryUsersRepositoryResponse,
} from '../repositories/in-memory/in-memory-users-repository.ts'
import { CreateUser, type CreateUserResponse } from './create-user.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.ts'

let usersRepository: InMemoryUsersRepositoryResponse
let createUser: CreateUserResponse

describe('Create user use case', () => {
  beforeEach(() => {
    usersRepository = InMemoryUsersRepository()
    createUser = CreateUser(usersRepository)
  })

  it('should be abre do create users', async () => {
    await createUser.execute({
      firstName: 'Michael',
      lastName: 'Scott',
      email: 'ilovepaper@email.com',
      password: 'ihatetoby',
    })

    const isEmailUsed = !!(await usersRepository.findByEmail(
      'ilovepaper@email.com'
    ))

    expect(isEmailUsed).toBe(true)
  })

  it('should hash user password upon creation', async () => {
    await createUser.execute({
      firstName: 'Michael',
      lastName: 'Scott',
      email: 'ilovepaper@email.com',
      password: 'ihatetoby',
    })

    const createdUserPasswordHash = usersRepository.users[0].password_hash
    const isPasswordCorrectlyHashed = bcrypt.compareSync(
      'ihatetoby',
      createdUserPasswordHash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to create user with same e-mail twice', async () => {
    const email = 'ilovepaper@email.com'

    await createUser.execute({
      firstName: 'Michael',
      lastName: 'Scott',
      email,
      password: 'ihatetoby',
    })

    await expect(async () => {
      await createUser.execute({
        firstName: 'Dwight',
        lastName: 'Schrute',
        email,
        password: 'ilovemichael',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
