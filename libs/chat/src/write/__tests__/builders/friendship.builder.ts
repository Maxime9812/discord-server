import { Friendship, FriendshipSnapshot } from '../../domain'

export const friendshipBuilder = (
    snapshot: FriendshipSnapshot = {
        friendId: '1',
        startedAt: new Date('2024-10-23'),
    }
) => ({
    withFriendId(friendId: string) {
        return friendshipBuilder({ ...snapshot, friendId })
    },
    withStartedAt(startedAt: Date) {
        return friendshipBuilder({ ...snapshot, startedAt })
    },
    build() {
        return Friendship.fromSnapshot(snapshot)
    },
})
