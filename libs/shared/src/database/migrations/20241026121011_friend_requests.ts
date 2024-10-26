import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('friend_requests', (table) => {
        table.uuid('id').primary()
        table.uuid('sender_id')
        table.uuid('receiver_id')
        table.datetime('requested_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('friend_requests')
}
