import { Pool } from 'pg'
import { env } from './env.js'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = {
  query: async (query: string, params?: (string | number)[]) => {
    const client = await pool.connect()

    try {
      const resp = await pool.query(query, params ?? [])

      return resp.rows
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      client.release()
    }
  },
}
