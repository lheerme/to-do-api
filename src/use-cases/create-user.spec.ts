import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryUsersRepository,
  type InMemoryUsersRepositoryResponse,
} from '../repositories/in-memory/in-memory-users-repository.ts'
import { CreateUser, type CreateUserReturn } from './create-user.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.ts'

let usersRepository: InMemoryUsersRepositoryResponse
let sut: CreateUserReturn

describe('Create user use case', () => {
  beforeEach(() => {
    usersRepository = InMemoryUsersRepository()
    sut = CreateUser(usersRepository)
  })

  it('should be abre do create users', async () => {
    const { user } = await sut.execute({
      firstName: 'Michael',
      lastName: 'Scott',
      email: 'ilovepaper@email.com',
      password: 'ihatetoby',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon creation', async () => {
    const { user } = await sut.execute({
      firstName: 'Michael',
      lastName: 'Scott',
      email: 'ilovepaper@email.com',
      password: 'ihatetoby',
    })

    const isPasswordCorrectlyHashed = bcrypt.compareSync(
      'ihatetoby',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to create user with same e-mail twice', async () => {
    const email = 'ilovepaper@email.com'

    await sut.execute({
      firstName: 'Michael',
      lastName: 'Scott',
      email,
      password: 'ihatetoby',
    })

    await expect(async () => {
      await sut.execute({
        firstName: 'Dwight',
        lastName: 'Schrute',
        email,
        password: 'ilovemichael',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
