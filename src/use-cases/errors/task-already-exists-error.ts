export class TaskAlreadyExistsError extends Error {
  statusCode: number

  constructor() {
    super('Task already exists in this to-do list.')
    this.statusCode = 409
  }
}
