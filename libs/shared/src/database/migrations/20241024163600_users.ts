import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary()
        table.string('username').unique()
        table.string('password').unique()
        table.datetime('registered_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}
