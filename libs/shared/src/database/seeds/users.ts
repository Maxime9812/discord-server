import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
    await knex('users').del()

    await knex('users').insert([
        {
            id: '49001600-3501-4824-a6f3-3bf882e7f7db',
            username: 'maxime',
            password: 'password',
            registered_at: '2021-10-01T00:00:00.000Z',
        },
    ])
}
