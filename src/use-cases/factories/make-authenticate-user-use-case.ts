import { NodePgUsersRepository } from '../../repositories/node-pg/node-pg-users-repository.ts'
import { AuthenticateUser } from '../authenticate-user.ts'

export function MakeAuthenticateUserUseCase() {
  const usersRepository = NodePgUsersRepository()
  const authenticateUserUseCase = AuthenticateUser(usersRepository)

  return authenticateUserUseCase
}
