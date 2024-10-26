import {
    FriendRequestSnapshot,
    FriendshipSnapshot,
    UserSocial,
} from '@app/chat/write/domain'
import { UserSocialRepository } from '@app/chat/write/gateways'
import { Knex } from 'knex'
import { FriendshipPm, UserPm } from './persistence-models'
import { FriendRequestPm } from './persistence-models/friend-request.pm'

export class KnexUserSocialRepository implements UserSocialRepository {
    constructor(private knex: Knex) {}

    async byId(id: string): Promise<UserSocial | undefined> {
        const user = await this.knex<UserPm>('users').where('id', id).first()
        if (!user) {
            return
        }

        const friendships = await this.knex<FriendshipPm>('friendships')
            .select()
            .where('friend_id', id)
            .orWhere('friend_2_id', id)

        const friends = friendships.map((f) => {
            return {
                id: f.id,
                userId: f.friend_id,
                userId2: f.friend_2_id,
                startedAt: f.started_at,
            }
        })

        const friendRequestsPm = await this.knex<FriendRequestPm>(
            'friend_requests'
        )
            .select()
            .where('receiver_id', id)
            .orWhere('sender_id', id)

        const friendRequests = friendRequestsPm.map((f) => {
            return {
                id: f.id,
                senderId: f.sender_id,
                receiverId: f.receiver_id,
                requestedAt: f.requested_at,
            }
        })

        return UserSocial.fromSnapshot({
            id: user.id,
            friends,
            friendRequests,
        })
    }

    async save(social: UserSocial): Promise<void> {
        const { friends, friendRequests } = social.snapshot

        const friendships = await this.knex<FriendshipPm>('friendships')
            .select()
            .where('friend_id', social.id)
            .orWhere('friend_2_id', social.id)

        const deletedFriendships = friendships.filter((f) => {
            return !friends.some((fr) => fr.id === f.id)
        })

        if (deletedFriendships.length > 0) {
            await this.knex('friendships')
                .delete()
                .whereIn(
                    'id',
                    deletedFriendships.map((f) => f.id)
                )
        }

        if (friends.length > 0) {
            await this.knex('friendships')
                .insert(
                    friends.map(
                        KnexUserSocialRepository.friendshipToPersistence
                    )
                )
                .onConflict('id')
                .merge()
        }

        const friendRequestsPm = await this.knex<FriendRequestPm>(
            'friend_requests'
        )
            .select()
            .where('receiver_id', social.id)
            .orWhere('sender_id', social.id)

        const deletedFriendRequests = friendRequestsPm.filter((f) => {
            return !friendRequests.some((fr) => fr.id === f.id)
        })

        if (deletedFriendRequests.length > 0) {
            await this.knex('friend_requests')
                .delete()
                .whereIn(
                    'id',
                    deletedFriendRequests.map((f) => f.id)
                )
        }

        if (friendRequests.length > 0) {
            await this.knex('friend_requests')
                .insert(
                    friendRequests.map(
                        KnexUserSocialRepository.friendRequestToPersistence
                    )
                )
                .onConflict('id')
                .merge()
        }
    }

    private static friendRequestToPersistence(
        friendRequest: FriendRequestSnapshot
    ): FriendRequestPm {
        return {
            id: friendRequest.id,
            sender_id: friendRequest.senderId,
            receiver_id: friendRequest.receiverId,
            requested_at: friendRequest.requestedAt,
        }
    }

    private static friendshipToPersistence(
        friendship: FriendshipSnapshot
    ): FriendshipPm {
        return {
            id: friendship.id,
            friend_id: friendship.userId,
            friend_2_id: friendship.userId2,
            started_at: friendship.startedAt,
        }
    }
}
