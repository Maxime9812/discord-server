import { Chatter } from '@app/chat/write/domain'
import { ChatterRepository } from '@app/chat/write/gateways'
import { Knex } from 'knex'
import { FriendshipPm, UserPm } from './persistence-models'

export class KnexChatterRepository implements ChatterRepository {
    constructor(private knex: Knex) {}

    async byId(id: string): Promise<Chatter | undefined> {
        const user = await this.knex<UserPm>('users').where('id', id).first()
        if (!user) {
            return
        }

        const friendship = await this.knex<FriendshipPm>('friendships')
            .select()
            .where('friend_id', id)
            .orWhere('friend_2_id', id)

        const friends = friendship.map((f) => {
            return f.friend_id === id ? f.friend_2_id : f.friend_id
        })

        return Chatter.fromSnapshot({
            id: user.id,
            friends,
        })
    }
}
