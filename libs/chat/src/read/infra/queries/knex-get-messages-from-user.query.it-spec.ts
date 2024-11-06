import knex, { Knex } from 'knex'
import { KnexGetMessagesFromUserQuery } from './knex-get-message-from-user.query'
import { knexConfig } from '@app/shared'
import { resetDB } from 'test/docker-manager'
import { MessagePm } from '@app/chat/write'
import { Message } from '../../domain'

const USER_ID_1 = 'ab3b7dd6-6825-4503-a3d1-c1e4a6c50731'
const USER_ID_2 = '1d902bc3-3e6a-40ba-bf9a-0103a6eb031d'
const USER_ID_3 = '1d902bc3-3e6a-40ba-bf9a-0103a6eb031e'

describe('KnexGetMessagesFromUserQuery', () => {
    let sqlConnection: Knex
    let query: KnexGetMessagesFromUserQuery

    beforeAll(() => {
        sqlConnection = knex(knexConfig.test)
    })

    afterAll(async () => {
        await sqlConnection.destroy()
    })

    beforeEach(async () => {
        await resetDB(sqlConnection)
        query = new KnexGetMessagesFromUserQuery(sqlConnection)
    })

    test('No messages founds', async () => {
        const messages = await query.execute(USER_ID_1, USER_ID_2)

        expect(messages).toEqual([])
    })

    describe('Messages found', () => {
        test('Messages send by user', async () => {
            await insertMessages([
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7723',
                    emitter_id: USER_ID_1,
                    receiver_id: USER_ID_2,
                    content: 'message 1',
                    send_at: new Date('2024-01-01'),
                    deleted: false,
                },
            ])
            const messages = await query.execute(USER_ID_1, USER_ID_2)

            expect(messages).toEqual<Message[]>([
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7723',
                    emitterId: USER_ID_1,
                    receiverId: USER_ID_2,
                    content: 'message 1',
                    sendAt: new Date('2024-01-01'),
                },
            ])
        })

        test('Messages received by user', async () => {
            await insertMessages([
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7723',
                    emitter_id: USER_ID_2,
                    receiver_id: USER_ID_1,
                    content: 'message 1',
                    send_at: new Date('2024-01-01'),
                    deleted: false,
                },
            ])
            const messages = await query.execute(USER_ID_1, USER_ID_2)

            expect(messages).toEqual<Message[]>([
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7723',
                    emitterId: USER_ID_2,
                    receiverId: USER_ID_1,
                    content: 'message 1',
                    sendAt: new Date('2024-01-01'),
                },
            ])
        })

        test('Messages is sorted by send date DESC', async () => {
            await insertMessages([
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7723',
                    emitter_id: USER_ID_1,
                    receiver_id: USER_ID_2,
                    content: 'message 1',
                    send_at: new Date('2024-01-01'),
                    deleted: false,
                },
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7724',
                    emitter_id: USER_ID_2,
                    receiver_id: USER_ID_1,
                    content: 'message 2',
                    send_at: new Date('2024-01-02'),
                    deleted: false,
                },
            ])
            const messages = await query.execute(USER_ID_1, USER_ID_2)

            expect(messages).toEqual<Message[]>([
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7724',
                    emitterId: USER_ID_2,
                    receiverId: USER_ID_1,
                    content: 'message 2',
                    sendAt: new Date('2024-01-02'),
                },
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7723',
                    emitterId: USER_ID_1,
                    receiverId: USER_ID_2,
                    content: 'message 1',
                    sendAt: new Date('2024-01-01'),
                },
            ])
        })

        test('User has sent multiple message to mulptiple friends', async () => {
            await insertMessages([
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7723',
                    emitter_id: USER_ID_2,
                    receiver_id: USER_ID_1,
                    content: 'message 1',
                    send_at: new Date('2024-01-01'),
                    deleted: false,
                },
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7724',
                    emitter_id: USER_ID_1,
                    receiver_id: USER_ID_3,
                    content: 'message 2',
                    send_at: new Date('2024-01-02'),
                    deleted: false,
                },
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7725',
                    emitter_id: USER_ID_2,
                    receiver_id: USER_ID_3,
                    content: 'message 3',
                    send_at: new Date('2024-01-03'),
                    deleted: false,
                },
            ])
            const messages = await query.execute(USER_ID_1, USER_ID_2)

            expect(messages).toEqual<Message[]>([
                {
                    id: '8938b848-a93e-4a08-af22-39da8bca7723',
                    emitterId: USER_ID_2,
                    receiverId: USER_ID_1,
                    content: 'message 1',
                    sendAt: new Date('2024-01-01'),
                },
            ])
        })
    })

    function insertMessages(message: MessagePm[]) {
        return sqlConnection('messages').insert(message)
    }
})
