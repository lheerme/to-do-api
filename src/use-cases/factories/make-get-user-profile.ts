import { NodePgUserRepository } from '../../repositories/node-pg/node-pg-user-repository.ts'
import { GetUserProfile } from '../get-user-profile.ts'

export function makeGetUserProfile() {
  const userRepository = NodePgUserRepository()
  const getUserUseCase = GetUserProfile(userRepository)

  return getUserUseCase
}
