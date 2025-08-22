export class InvalidCredentialsError extends Error {
  statusCode: number

  constructor() {
    super('Invalid credentials.')
    this.statusCode = 400
  }
}
