import { NodePgUserRepository } from '../../repositories/node-pg/node-pg-user-repository.ts'
import { AuthenticateUser } from '../authenticate-user.ts'

export function MakeAuthenticateUserUseCase() {
  const userRepository = NodePgUserRepository()
  const authenticateUserUseCase = AuthenticateUser(userRepository)

  return authenticateUserUseCase
}
