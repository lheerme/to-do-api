import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryUserRepository,
  type InMemoryUserRepositoryResponse,
} from '../repositories/in-memory/in-memory-user-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'
import {
  GetUserProfile,
  type GetUserProfileReturn,
} from './get-user-profile.ts'

let userRepository: InMemoryUserRepositoryResponse
let sut: GetUserProfileReturn

describe('Get user use case', () => {
  beforeEach(() => {
    userRepository = InMemoryUserRepository()
    sut = GetUserProfile(userRepository)
  })

  it('should be able to return user', async () => {
    const id = randomUUID()

    await userRepository.createUser({
      id,
      first_name: 'Michael',
      last_name: 'Scott',
      email: 'ilovepaper@email.com',
      created_at: new Date(),
      password_hash: bcrypt.hashSync('ihatetoby', 6),
    })

    const user = await sut.execute({ id })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to return with wrong id', async () => {
    const randomId = randomUUID()
    const id = randomUUID()

    await userRepository.createUser({
      id,
      first_name: 'Michael',
      last_name: 'Scott',
      email: 'ilovepaper@email.com',
      created_at: new Date(),
      password_hash: bcrypt.hashSync('ihatetoby', 6),
    })

    await expect(async () => {
      await sut.execute({ id: randomId })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
