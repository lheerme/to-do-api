import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  await pgm.createTable('todos', {
    id: { type: 'UUID', primaryKey: true },
    title: { type: 'VARCHAR(50)', notNull: true },
    created_at: { type: 'TIMESTAMPTZ', default: pgm.func('now()') },
    user_id: { type: 'UUID', references: 'users' },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  await pgm.dropTable('todos', { ifExists: true })
}
