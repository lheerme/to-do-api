export class DatabaseOperationError extends AggregateError {
  statusCode: number

  constructor(errors: AggregateError['errors']) {
    super(
      'An unexpected error occurred during a database operation. Please try again later.'
    )

    this.statusCode = 500
    this.errors = errors
  }
}
