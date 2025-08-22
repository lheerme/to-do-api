export class UserAlreadyExistsError extends Error {
  statusCode: number

  constructor() {
    super('E-mail already exists.')
    this.statusCode = 409
  }
}
