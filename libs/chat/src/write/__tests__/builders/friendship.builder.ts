import { Friendship, FriendshipSnapshot } from '../../domain'

export const friendshipBuilder = (
    snapshot: FriendshipSnapshot = {
        id: '1',
        userId: '1',
        userId2: '2',
        startedAt: new Date('2024-10-23'),
    }
) => ({
    withId(id: string) {
        return friendshipBuilder({ ...snapshot, id })
    },
    withUserId(userId: string) {
        return friendshipBuilder({ ...snapshot, userId: userId })
    },
    withUserId2(userId2: string) {
        return friendshipBuilder({ ...snapshot, userId2 })
    },
    withStartedAt(startedAt: Date) {
        return friendshipBuilder({ ...snapshot, startedAt })
    },
    build() {
        return Friendship.fromSnapshot(snapshot)
    },
})
