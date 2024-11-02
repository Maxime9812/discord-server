import { GetMeQuery, Me } from '@app/iam/queries'
import { Knex } from 'knex'

export class knexGetMeQuery implements GetMeQuery {
    constructor(private knex: Knex) {}

    execute(userId: string): Promise<Me> {
        return this.knex('users').where('id', userId).first('id', 'username')
    }
}
