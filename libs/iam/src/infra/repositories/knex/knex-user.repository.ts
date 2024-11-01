import { User } from '@app/iam/domain'
import { UserRepository } from '@app/iam/gateways'
import { Knex } from 'knex'
import { UserPm } from './persistence-models'

export class KnexUserRepository implements UserRepository {
    constructor(private knex: Knex) {}

    async save(user: User): Promise<void> {
        await this.knex<UserPm>('users')
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
        const user = await this.knex<UserPm>('users')
            .where('username', username)
            .first()

        return !!user
    }

    async getByUsername(username: string): Promise<User> {
        const user = await this.knex<UserPm>('users')
            .where('username', username)
            .first()
        if (!user) return

        return User.fromSnapshot({
            id: user.id,
            username: user.username,
            password: user.password,
            registeredAt: user.registered_at,
        })
    }
}
