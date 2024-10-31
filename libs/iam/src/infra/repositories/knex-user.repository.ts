import { User } from '@app/iam/domain'
import { UserRepository } from '@app/iam/gateways'
import { Knex } from 'knex'

export class KnexUserRepository implements UserRepository {
    constructor(private knex: Knex) {}

    async save(user: User): Promise<void> {
        await this.knex('users')
            .insert({
                id: user.id,
                username: user.snapshot.username,
                password: user.snapshot.password,
                registered_at: user.snapshot.registeredAt,
            })
            .onConflict('id')
            .merge()
    }

    async existsByUsername(username: string): Promise<boolean> {
        const user = await this.knex('users')
            .where('username', username)
            .first()

        return !!user
    }
}
