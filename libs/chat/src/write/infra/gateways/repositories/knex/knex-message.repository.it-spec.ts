import { knexConfig } from '@app/shared'
import knex, { Knex } from 'knex'
import { resetDB } from 'test/docker-manager'
import { KnexMessageRepository } from './knex-message.repository'
import { Message } from '@app/chat/write/domain'
import { messageBuilder } from '@app/chat/write/__tests__'

describe('KnexMessageRepository', () => {
    let sqlConnection: Knex
    let knexMessageRepository: KnexMessageRepository

    beforeAll(() => {
        sqlConnection = knex(knexConfig.test)
    })

    afterAll(async () => {
        await sqlConnection.destroy()
    })

    beforeEach(async () => {
        await resetDB(sqlConnection)
        knexMessageRepository = new KnexMessageRepository(sqlConnection)
    })

    describe('byId', () => {
        test('Message is not found', async () => {
            const message = await knexMessageRepository.byId(
                '349b8b68-109a-486f-bdc2-daedc31a6beb'
            )
            expect(message).toBeUndefined()
        })

        test('Message is found', async () => {
            const existingMessage = messageBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .withEmitterId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
                .withReceiverId('b33adf7e-3ae7-4f17-9560-3388251c266f')
                .sendAt(new Date('2024-10-23'))
                .withContent('Hello')
                .build()

            await insertMessage(existingMessage)
            const message = await knexMessageRepository.byId(
                '349b8b68-109a-486f-bdc2-daedc31a6beb'
            )
            expect(message?.snapshot).toEqual(existingMessage.snapshot)
        })
    })

    describe('save', () => {
        test('Save a new message', async () => {
            const message = messageBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .withEmitterId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
                .withReceiverId('b33adf7e-3ae7-4f17-9560-3388251c266f')
                .withContent('Hello')
                .sendAt(new Date('2024-10-23'))
                .build()

            await knexMessageRepository.save(message)

            thenMessagesShouldBe([message])
        })

        test('Update a message when it already exists', async () => {
            const existingMessageBuilder = messageBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .withEmitterId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
                .withReceiverId('b33adf7e-3ae7-4f17-9560-3388251c266f')
                .withContent('Hello')
                .sendAt(new Date('2024-10-23'))

            await insertMessage(existingMessageBuilder.build())

            const messageUpdated = existingMessageBuilder
                .withContent('Hi')
                .build()

            await knexMessageRepository.save(messageUpdated)

            thenMessagesShouldBe([messageUpdated])
        })
    })

    async function insertMessage(message: Message) {
        const snapshot = message.snapshot
        await sqlConnection('messages').insert({
            id: snapshot.id,
            emitter_id: snapshot.emitterId,
            receiver_id: snapshot.receiverId,
            content: snapshot.content,
            send_at: snapshot.sendAt,
            deleted: snapshot.deleted,
        })
    }

    async function thenMessagesShouldBe(messages: Message[]) {
        const messagesInDB = await sqlConnection('messages').select()
        expect(messagesInDB).toEqual(
            messages.map((message) => ({
                id: message.snapshot.id,
                emitter_id: message.snapshot.emitterId,
                receiver_id: message.snapshot.receiverId,
                content: message.snapshot.content,
                send_at: message.snapshot.sendAt,
                deleted: message.snapshot.deleted,
            }))
        )
    }
})
