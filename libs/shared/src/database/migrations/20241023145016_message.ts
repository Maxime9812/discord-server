import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('messages', (table) => {
        table.uuid('id').primary()
        table.uuid('emitter_id')
        table.uuid('receiver_id')
        table.string('content')
        table.datetime('send_at')
        table.boolean('deleted')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('messages')
}
