import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('friendships', (table) => {
        table.uuid('id').primary()
        table.uuid('friend_id')
        table.uuid('friend_2_id')
        table.datetime('started_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('friendships')
}
