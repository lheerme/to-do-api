import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  await pgm.createTable(
    'users',
    {
      id: { type: 'UUID', primaryKey: true },
      first_name: { type: 'VARCHAR(50)', notNull: true },
      last_name: { type: 'VARCHAR(50)', notNull: true },
      email: { type: 'VARCHAR(100)', notNull: true },
      password_hash: { type: 'TEXT', notNull: true },
      created_at: { type: 'TIMESTAMPTZ', default: pgm.func('now()') },
    },
    {
      ifNotExists: true,
    }
  )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  await pgm.dropTable('users', { ifExists: true })
}
