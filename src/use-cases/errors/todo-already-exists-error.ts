export class TodoAlreadyExistsError extends Error {
  statusCode: number

  constructor() {
    super('To-do list already exists.')
    this.statusCode = 409
  }
}
