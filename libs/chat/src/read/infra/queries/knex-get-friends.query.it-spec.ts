import knex, { Knex } from 'knex'
import { knexConfig } from '@app/shared'
import { resetDB } from 'test/docker-manager'
import { KnexGetFriendsQuery } from './knex-get-friends.query'
import { Friendship } from '@app/chat/write/domain'
import { FriendshipPm, UserPm } from '@app/chat/write'

const USER_ID = 'c8062fd1-b4b7-49fa-b9a3-c9c9acbf02b2'
const USER_ID_2 = '1d902bc3-3e6a-40ba-bf9a-0103a6eb031d'
const USER_ID_3 = '6bab7f53-e016-48c2-baf5-dd9bfdd9f77c'

describe('KnexGetFriendsQuery', () => {
    let sqlConnection: Knex
    let query: KnexGetFriendsQuery

    beforeAll(() => {
        sqlConnection = knex(knexConfig.test)
    })

    afterAll(async () => {
        await sqlConnection.destroy()
    })

    beforeEach(async () => {
        await resetDB(sqlConnection)
        query = new KnexGetFriendsQuery(sqlConnection)
    })

    test('No friends found', async () => {
        const friends = await query.execute(USER_ID)

        expect(friends).toEqual([])
    })

    test('Friends found', async () => {
        await insertUsers([
            {
                id: USER_ID_2,
                username: 'william',
                password: 'password',
                registered_at: new Date('2024-01-01'),
            },
            {
                id: USER_ID,
                username: 'maxime',
                password: 'password',
                registered_at: new Date('2024-01-01'),
            },
            {
                id: USER_ID_3,
                username: 'franco',
                password: 'password',
                registered_at: new Date('2024-01-01'),
            },
        ])
        await insertFriends([
            {
                id: '6938b848-a93e-4a08-af22-39da8bca7723',
                friend_id: USER_ID_3,
                friend_2_id: USER_ID,
                started_at: new Date('2024-01-01'),
            },
            {
                id: '8938b848-a93e-4a08-af22-39da8bca7723',
                friend_id: USER_ID,
                friend_2_id: USER_ID_2,
                started_at: new Date('2024-01-01'),
            },
        ])
        const friends = await query.execute(USER_ID)

        expect(friends).toEqual([
            {
                userId: USER_ID_2,
                username: 'william',
                startedAt: new Date('2024-01-01'),
            },
            {
                userId: USER_ID_3,
                username: 'franco',
                startedAt: new Date('2024-01-01'),
            },
        ])
    })

    function insertUsers(users: UserPm[]) {
        return sqlConnection('users').insert(users)
    }

    function insertFriends(friends: FriendshipPm[]) {
        return sqlConnection('friendships').insert(friends)
    }
})
