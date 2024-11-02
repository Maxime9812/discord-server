import knex, { Knex } from 'knex'
import { KnexGetChatsQuery } from './knex-get-chats.query'
import { knexConfig } from '@app/shared'
import { resetDB } from 'test/docker-manager'
import { MessagePm } from '@app/chat/write'

const USER_ID = 'c8062fd1-b4b7-49fa-b9a3-c9c9acbf02b2'
const USER_ID_2 = '1d902bc3-3e6a-40ba-bf9a-0103a6eb031d'
const USER_ID_3 = '6bab7f53-e016-48c2-baf5-dd9bfdd9f77c'

describe('KnexGetChatsQuery', () => {
    let sqlConnection: Knex
    let query: KnexGetChatsQuery

    beforeAll(() => {
        sqlConnection = knex(knexConfig.test)
    })

    afterAll(async () => {
        await sqlConnection.destroy()
    })

    beforeEach(async () => {
        await resetDB(sqlConnection)
        query = new KnexGetChatsQuery(sqlConnection)
    })

    test('No chats found', async () => {
        const chats = await query.execute(USER_ID)

        expect(chats).toEqual([])
    })

    test('Chats found with emitter', async () => {
        await insertMessage([
            {
                id: '8938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID_2,
                receiver_id: USER_ID,
                content: 'Hello',
                deleted: false,
                send_at: new Date('2024-01-01'),
            },
            {
                id: '7938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID_2,
                receiver_id: USER_ID,
                content: 'World',
                deleted: false,
                send_at: new Date('2024-01-02'),
            },
        ])
        const chats = await query.execute(USER_ID)

        expect(chats).toEqual([
            {
                chatterId: USER_ID_2,
            },
        ])
    })

    test('Chats found with reveiver', async () => {
        await insertMessage([
            {
                id: '6938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID,
                receiver_id: USER_ID_3,
                content: 'Hi',
                deleted: false,
                send_at: new Date('2024-01-03'),
            },
            {
                id: '5938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID,
                receiver_id: USER_ID_3,
                content: 'How are you?',
                deleted: false,
                send_at: new Date('2024-01-03'),
            },
        ])
        const chats = await query.execute(USER_ID)

        expect(chats).toEqual([
            {
                chatterId: USER_ID_3,
            },
        ])
    })

    test('Chats found with reveiver and emitter', async () => {
        await insertMessage([
            {
                id: '6938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID,
                receiver_id: USER_ID_3,
                content: 'Hi',
                deleted: false,
                send_at: new Date('2024-01-03'),
            },
            {
                id: '5938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID_3,
                receiver_id: USER_ID,
                content: 'How are you?',
                deleted: false,
                send_at: new Date('2024-01-03'),
            },
        ])
        const chats = await query.execute(USER_ID)

        expect(chats).toEqual([
            {
                chatterId: USER_ID_3,
            },
        ])
    })

    test('Chats is sorted by last message date DESC', async () => {
        await insertMessage([
            {
                id: '6938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID,
                receiver_id: USER_ID_3,
                content: 'Hi',
                deleted: false,
                send_at: new Date('2024-01-02'),
            },
            {
                id: '4938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID_2,
                receiver_id: USER_ID,
                content: 'Hi',
                deleted: false,
                send_at: new Date('2024-01-05'),
            },
            {
                id: '5938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID_3,
                receiver_id: USER_ID,
                content: 'How are you?',
                deleted: false,
                send_at: new Date('2024-01-03'),
            },
            {
                id: '3938b848-a93e-4a08-af22-39da8bca7723',
                emitter_id: USER_ID,
                receiver_id: USER_ID_3,
                content: 'Hi',
                deleted: false,
                send_at: new Date('2024-01-01'),
            },
        ])
        const chats = await query.execute(USER_ID)

        expect(chats).toEqual([
            {
                chatterId: USER_ID_2,
            },
            {
                chatterId: USER_ID_3,
            },
        ])
    })

    function insertMessage(messages: MessagePm[]) {
        return sqlConnection('messages').insert(messages)
    }
})
