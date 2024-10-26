import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
    await knex('users').del()

    await knex('users').insert([
        { id: '49001600-3501-4824-a6f3-3bf882e7f7db' },
        { id: '0c16374a-f2fd-4bd1-9304-296601013047' },
    ])
}
