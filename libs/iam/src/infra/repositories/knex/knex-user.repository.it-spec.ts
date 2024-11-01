import knex, { Knex } from 'knex'
import { KnexUserRepository } from './knex-user.repository'
import { knexConfig } from '@app/shared'
import { resetDB } from 'test/docker-manager'
import { userBuilder } from '@app/iam/__tests__'
import { User } from '@app/iam/domain'

describe('KnexUserRepository', () => {
    let sqlConnection: Knex
    let repository: KnexUserRepository

    beforeAll(() => {
        sqlConnection = knex(knexConfig.test)
    })

    afterAll(async () => {
        await sqlConnection.destroy()
    })

    beforeEach(async () => {
        await resetDB(sqlConnection)
        repository = new KnexUserRepository(sqlConnection)
    })

    describe('save', () => {
        test('User is created', async () => {
            const user = userBuilder()
                .withId('ab3b7dd6-6825-4503-a3d1-c1e4a6c50731')
                .build()

            await repository.save(user)

            await thenUsersShouldBe([user])
        })

        test('User is updated when already exist', async () => {
            const user = userBuilder()
                .withId('ab3b7dd6-6825-4503-a3d1-c1e4a6c50731')
                .build()

            await insertUser(user)

            const updatedUser = userBuilder()
                .withId('ab3b7dd6-6825-4503-a3d1-c1e4a6c50731')
                .withUsername('new-username')
                .build()

            await repository.save(updatedUser)

            await thenUsersShouldBe([updatedUser])
        })
    })

    describe('existsByUsername', () => {
        test('No user with username', async () => {
            const exists = await repository.existsByUsername('username')
            expect(exists).toBeFalsy()
        })

        test('User with username exists', async () => {
            const user = userBuilder()
                .withId('ab3b7dd6-6825-4503-a3d1-c1e4a6c50731')
                .withUsername('maxime')
                .build()

            await insertUser(user)

            const exists = await repository.existsByUsername('maxime')
            expect(exists).toBeTruthy()
        })
    })

    describe('getByUsername', () => {
        test('No user with username', async () => {
            const userFromDb = await repository.getByUsername('maxime')
            expect(userFromDb).toBeUndefined()
        })

        test('User with username exists', async () => {
            const user = userBuilder()
                .withId('ab3b7dd6-6825-4503-a3d1-c1e4a6c50731')
                .withUsername('maxime')
                .build()

            await insertUser(user)

            const userFromDb = await repository.getByUsername('maxime')
            expect(userFromDb?.snapshot).toEqual(user.snapshot)
        })
    })

    async function insertUser(user: User) {
        await sqlConnection('users').insert({
            id: user.id,
            username: user.snapshot.username,
            password: user.snapshot.password,
            registered_at: user.snapshot.registeredAt,
        })
    }

    async function thenUsersShouldBe(users: User[]) {
        const usersInDb = await sqlConnection.select().from('users')
        expect(usersInDb).toEqual(
            users.map((user) => ({
                id: user.id,
                username: user.snapshot.username,
                password: user.snapshot.password,
                registered_at: user.snapshot.registeredAt,
            }))
        )
    }
})
