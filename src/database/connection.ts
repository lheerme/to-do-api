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
      if (error instanceof Error) {
        const errorMessage = error.message

        if (errorMessage.includes('ECONNREFUSED')) {
          throw new DatabaseOperationError([])
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
