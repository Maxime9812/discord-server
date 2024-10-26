import knex, { Knex } from 'knex'
import { KnexChatterRepository } from './knex-chatter.repository'
import { resetDB } from 'test/docker-manager'
import { knexConfig } from '@app/shared'
import { chatterBuilder } from '@app/chat/write/__tests__'
import { Chatter } from '@app/chat/write/domain'

describe('Knex chatter repository', () => {
    let sqlConnection: Knex
    let repository: KnexChatterRepository

    beforeAll(() => {
        sqlConnection = knex(knexConfig.test)
    })

    afterAll(async () => {
        await sqlConnection.destroy()
    })

    beforeEach(async () => {
        await resetDB(sqlConnection)
        repository = new KnexChatterRepository(sqlConnection)
    })

    describe('byId', () => {
        test('Chatter is not found', async () => {
            const chatter = await repository.byId(
                '349b8b68-109a-486f-bdc2-daedc31a6beb'
            )
            expect(chatter).toBeUndefined()
        })

        test('Chatter is found', async () => {
            const existingChatter = chatterBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .build()

            await insertChatter(existingChatter)

            const chatter = await repository.byId(
                '349b8b68-109a-486f-bdc2-daedc31a6beb'
            )

            expect(chatter?.snapshot).toEqual(existingChatter.snapshot)
        })

        test('Chatter has friends', async () => {
            const FRANCO = chatterBuilder()
                .withId('6e7b09f1-ca5c-4f52-842c-28dbbc227a72')
                .build()
            const WILLIAM = chatterBuilder()
                .withId('e38b14eb-c765-4d84-84b8-9b9977eb68db')
                .build()
            const existingChatter = chatterBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .withFriend(WILLIAM.id)
                .withFriend(FRANCO.id)
                .build()

            await insertChatter(existingChatter)
            await insertFriendship({
                id: 'ebad3cc1-bf9e-4b2f-9907-55ea6404b88e',
                friendId: existingChatter.id,
                friend2Id: WILLIAM.id,
                startedAt: new Date('2024-10-23'),
            })
            await insertFriendship({
                id: '900ecda5-02eb-40b4-8ed6-64d7c136dd13',
                friendId: FRANCO.id,
                friend2Id: existingChatter.id,
                startedAt: new Date('2024-10-23'),
            })

            const chatter = await repository.byId(
                '349b8b68-109a-486f-bdc2-daedc31a6beb'
            )

            expect(chatter?.snapshot).toEqual(existingChatter.snapshot)
        })
    })

    async function insertChatter(chatter: Chatter) {
        return sqlConnection('users').insert({
            id: chatter.id,
        })
    }

    async function insertFriendship(friendship: {
        id: string
        friendId: string
        friend2Id: string
        startedAt: Date
    }) {
        return sqlConnection('friendships').insert({
            id: friendship.id,
            friend_id: friendship.friendId,
            friend_2_id: friendship.friend2Id,
            started_at: friendship.startedAt,
        })
    }
})
