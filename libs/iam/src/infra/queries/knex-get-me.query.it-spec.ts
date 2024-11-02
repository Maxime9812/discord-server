import knex, { Knex } from 'knex'
import { knexGetMeQuery } from './knex-get-me.query'
import { knexConfig } from '@app/shared'
import { resetDB } from 'test/docker-manager'
import { UserPm } from '@app/chat/write'

const USER_ID = 'c8062fd1-b4b7-49fa-b9a3-c9c9acbf02b2'

describe('KnexGetMeQuery', () => {
    let sqlConnection: Knex
    let query: knexGetMeQuery

    beforeAll(() => {
        sqlConnection = knex(knexConfig.test)
    })

    afterAll(async () => {
        await sqlConnection.destroy()
    })

    beforeEach(async () => {
        await resetDB(sqlConnection)
        query = new knexGetMeQuery(sqlConnection)
    })

    test('No user found', async () => {
        const user = await query.execute(USER_ID)

        expect(user).toBeUndefined()
    })

    test('User found', async () => {
        await insertUser({
            id: USER_ID,
            username: 'user',
            password: 'password',
            registered_at: new Date('2024-01-01'),
        })

        const user = await query.execute(USER_ID)

        expect(user).toEqual({
            id: USER_ID,
            username: 'user',
        })
    })

    function insertUser(user: UserPm) {
        return sqlConnection('users').insert(user)
    }
})
