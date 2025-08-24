export class ResourceNotFoundError extends Error {
  statusCode: number

  constructor() {
    super('Resource not found.')

    this.statusCode = 404
  }
}
