import { NodePgUsersRepository } from '../../repositories/node-pg/node-pg-users-repository.ts'
import { CreateUser } from '../create-user.ts'

export function MakeCreateUserUseCase() {
  const usersRepository = NodePgUsersRepository()
  const createUserUseCase = CreateUser(usersRepository)

  return createUserUseCase
}
