import {
    FriendRequestSnapshot,
    FriendshipSnapshot,
    UserSocial,
    UserSocialSnapshot,
} from '@app/chat/write/domain'
import { UserSocialRepository } from '@app/chat/write/gateways'
import { Knex } from 'knex'
import { FriendshipPm, UserPm } from './persistence-models'
import { FriendRequestPm } from './persistence-models/friend-request.pm'

export class KnexUserSocialRepository implements UserSocialRepository {
    constructor(private knex: Knex) {}

    async byId(id: string): Promise<UserSocial | undefined> {
        const user = await this.knex<UserPm>('users').where('id', id).first()
        if (!user) return

        return UserSocial.fromSnapshot({
            id: user.id,
            friends: (await this.getFriendshipsPm(id)).map(
                KnexUserSocialRepository.friendshipToDomain
            ),
            friendRequests: (await this.getFriendRequestsPm(id)).map(
                KnexUserSocialRepository.friendRequestToDomain
            ),
        })
    }

    async save(social: UserSocial): Promise<void> {
        const snapshot = social.snapshot

        await this.saveFriendships(snapshot)
        await this.saveFriendRequests(snapshot)
    }

    private async saveFriendships(social: UserSocialSnapshot): Promise<void> {
        const { friends } = social

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
    }

    private async saveFriendRequests(
        social: UserSocialSnapshot
    ): Promise<void> {
        const { friendRequests } = social

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

    private getFriendshipsPm(id: string): Promise<FriendshipPm[]> {
        return this.knex<FriendshipPm>('friendships')
            .select()
            .where('friend_id', id)
            .orWhere('friend_2_id', id)
    }

    private getFriendRequestsPm(id: string): Promise<FriendRequestPm[]> {
        return this.knex<FriendRequestPm>('friend_requests')
            .select()
            .where('receiver_id', id)
            .orWhere('sender_id', id)
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

    private static friendRequestToDomain(
        pm: FriendRequestPm
    ): FriendRequestSnapshot {
        return {
            id: pm.id,
            senderId: pm.sender_id,
            receiverId: pm.receiver_id,
            requestedAt: pm.requested_at,
        }
    }

    private static friendshipToDomain(pm: FriendshipPm): FriendshipSnapshot {
        return {
            id: pm.id,
            userId: pm.friend_id,
            userId2: pm.friend_2_id,
            startedAt: pm.started_at,
        }
    }
}
