import { Knex } from 'knex'
import { GetFriendRequestsQuery } from '../../queries'
import { FriendRequestPm } from '@app/chat/write/infra/gateways/repositories/knex/persistence-models/friend-request.pm'

export class KnexGetFriendRequestsQuery implements GetFriendRequestsQuery {
    constructor(private knex: Knex) {}

    execute(userId: string) {
        return this.knex<FriendRequestPm>('friend_requests')
            .select(
                'id',
                'sender_id as senderId',
                'requested_at as requestedAt'
            )
            .where('receiver_id', userId)
            .orderBy('requested_at', 'desc')
    }
}
