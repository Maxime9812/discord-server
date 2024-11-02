import { Knex } from 'knex'
import { GetFriendsQuery } from '../../queries'
import { Friend } from '../../domain/friend'
import { FriendshipPm } from '@app/chat/write'

export class KnexGetFriendsQuery implements GetFriendsQuery {
    constructor(private knex: Knex) {}

    async execute(userId: string): Promise<Friend[]> {
        const friends = await this.knex<FriendshipPm>('friendships')
            .select(
                'friendships.friend_2_id as friend2Id',
                'friendships.friend_id as friendId',
                'users.username',
                'users2.username as username2',
                'friendships.started_at as startedAt'
            )
            .join('users', 'friendships.friend_id', '=', 'users.id')
            .join(
                'users as users2',
                'friendships.friend_2_id',
                '=',
                'users2.id'
            )
            .where('friendships.friend_id', userId)
            .orWhere('friendships.friend_2_id', userId)
            .orderBy('friendships.started_at', 'desc')

        return friends.map((friend) => {
            const isUser1 = userId == friend.friendId

            return {
                userId: isUser1 ? friend.friend2Id : friend.friendId,
                username: isUser1 ? friend.username2 : friend.username,
                startedAt: friend.startedAt,
            }
        })
    }
}

