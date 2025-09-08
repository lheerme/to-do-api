import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  await pgm.createTable('tasks', {
    id: { type: 'UUID', primaryKey: true },
    title: { type: 'VARCHAR(50)', notNull: true },
    created_at: { type: 'TIMESTAMP', default: pgm.func('now()') },
    is_completed: { type: 'BOOLEAN', notNull: true, default: false },
    todo_id: { type: 'UUID', references: 'todos' },
    user_id: { type: 'UUID', references: 'users' },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  await pgm.dropTable('tasks', { ifExists: true })
}
