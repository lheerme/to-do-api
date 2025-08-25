export class TodoAlreadyExistsError extends Error {
  statusCode: number

  constructor() {
    super('Todo already exists.')
    this.statusCode = 409
  }
}
