import { Pool, type PoolClient } from 'pg'
import { env } from '../env.ts'
import { DatabaseOperationError } from './errors/database-operation-error.ts'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = {
  query: async <T>(
    query: string,
    params?: (string | number)[]
  ): Promise<T[]> => {
    let client: PoolClient | undefined

    try {
      client = await pool.connect()
      const resp = await client.query(query, params ?? [])

      return resp.rows
    } catch (error) {
      if (error instanceof AggregateError) {
        const errorCode = error.errors[0].code

        if (errorCode === 'ECONNREFUSED') {
          throw new DatabaseOperationError(error.errors)
        }
      }

      throw error
    } finally {
      if (client) {
        client.release()
      }
    }
  },
}
