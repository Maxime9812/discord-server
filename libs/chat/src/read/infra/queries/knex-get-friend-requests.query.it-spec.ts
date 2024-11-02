import knex, { Knex } from 'knex'
import { KnexGetFriendRequestsQuery } from './knex-get-friend-requests.query'
import { knexConfig } from '@app/shared'
import { resetDB } from 'test/docker-manager'
import { FriendRequestPm } from '@app/chat/write/infra/gateways/repositories/knex/persistence-models/friend-request.pm'

const USER_ID = 'c8062fd1-b4b7-49fa-b9a3-c9c9acbf02b2'
const USER_ID_2 = '1d902bc3-3e6a-40ba-bf9a-0103a6eb031d'
describe('KnexGetFriendRequests', () => {
    let sqlConnection: Knex
    let query: KnexGetFriendRequestsQuery

    beforeAll(() => {
        sqlConnection = knex(knexConfig.test)
    })

    afterAll(async () => {
        await sqlConnection.destroy()
    })

    beforeEach(async () => {
        await resetDB(sqlConnection)
        query = new KnexGetFriendRequestsQuery(sqlConnection)
    })

    test('No friend requests found', async () => {
        const friendRequests = await query.execute(USER_ID)

        expect(friendRequests).toEqual([])
    })

    test('Friend requests found', async () => {
        await insertFriendRequests([
            {
                id: '8938b848-a93e-4a08-af22-39da8bca7723',
                sender_id: USER_ID_2,
                receiver_id: USER_ID,
                requested_at: new Date('2024-01-01'),
            },
        ])
        const friendRequests = await query.execute(USER_ID)

        expect(friendRequests).toEqual([
            {
                id: '8938b848-a93e-4a08-af22-39da8bca7723',
                senderId: USER_ID_2,
                requestedAt: new Date('2024-01-01'),
            },
        ])
    })

    test('Friend requests sorted by requested at DESC', async () => {
        await insertFriendRequests([
            {
                id: '8938b848-a93e-4a08-af22-39da8bca7723',
                sender_id: USER_ID_2,
                receiver_id: USER_ID,
                requested_at: new Date('2024-01-01'),
            },
            {
                id: '8938b848-a93e-4a08-af22-39da8bca7724',
                sender_id: USER_ID_2,
                receiver_id: USER_ID,
                requested_at: new Date('2024-01-02'),
            },
        ])
        const friendRequests = await query.execute(USER_ID)

        expect(friendRequests).toEqual([
            {
                id: '8938b848-a93e-4a08-af22-39da8bca7724',
                senderId: USER_ID_2,
                requestedAt: new Date('2024-01-02'),
            },
            {
                id: '8938b848-a93e-4a08-af22-39da8bca7723',
                senderId: USER_ID_2,
                requestedAt: new Date('2024-01-01'),
            },
        ])
    })

    function insertFriendRequests(friendRequests: FriendRequestPm[]) {
        return sqlConnection('friend_requests').insert(friendRequests)
    }
})
