import type { User } from '../interfaces/user.ts'
import type { UserRepository } from '../repositories/user-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'

export interface GetUserProfileRequest {
  id: string
}

interface GetUserProfileResponse extends Omit<User, 'password_hash'> {}

export interface GetUserProfileReturn {
  execute: (arg0: GetUserProfileRequest) => Promise<GetUserProfileResponse>
}

export function GetUserProfile(
  userRepository: UserRepository
): GetUserProfileReturn {
  async function execute({
    id,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await userRepository.findById(id)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    Reflect.deleteProperty(user, 'password_hash')

    return user
  }

  return { execute }
}
