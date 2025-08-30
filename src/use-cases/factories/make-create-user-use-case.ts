import { NodePgUserRepository } from '../../repositories/node-pg/node-pg-user-repository.ts'
import { CreateUser } from '../create-user.ts'

export function MakeCreateUserUseCase() {
  const userRepository = NodePgUserRepository()
  const createUserUseCase = CreateUser(userRepository)

  return createUserUseCase
}
