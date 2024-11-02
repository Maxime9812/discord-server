import { FriendshipPm } from '@app/chat/write'
import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
    await knex('users').del()

    await knex('users').insert([
        {
            id: '49001600-3501-4824-a6f3-3bf882e7f7db',
            username: 'maxime',
            password:
                '$2b$10$3IHkVzcaSQCf6sBdxwG9DOuDuT/LcqY4PyuJGUAvAk7vo1DHzrsmq',
            registered_at: '2021-10-01T00:00:00.000Z',
        },
        {
            id: 'f0dbb6ec-b8cb-46c6-995e-af06a5236dac',
            username: 'william',
            password:
                '$2b$10$3IHkVzcaSQCf6sBdxwG9DOuDuT/LcqY4PyuJGUAvAk7vo1DHzrsmq',
            registered_at: '2021-10-01T00:00:00.000Z',
        },
    ])

    await knex('friendships').del()

    await knex('friendships').insert<FriendshipPm>([
        {
            id: '24b53989-a484-4827-827e-b9b3e9f0e1e7',
            friend_id: '49001600-3501-4824-a6f3-3bf882e7f7db',
            friend_2_id: 'f0dbb6ec-b8cb-46c6-995e-af06a5236dac',
            started_at: '2021-10-01T00:00:00.000Z',
        },
    ])
}
