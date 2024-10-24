import {
    FriendRequest,
    Friendship,
    UserSocial,
    UserSocialSnapshot,
} from '../../domain'

export const userSocialBuilder = (
    snapshot: UserSocialSnapshot = {
        id: '1',
        friends: [],
        friendRequests: [],
    }
) => ({
    withId(id: string) {
        return userSocialBuilder({ ...snapshot, id })
    },
    withFriend(friend: Friendship) {
        return userSocialBuilder({
            ...snapshot,
            friends: [...snapshot.friends, friend.snapshot],
        })
    },
    withoutFriend() {
        return userSocialBuilder({
            ...snapshot,
            friends: [],
        })
    },
    withoutFriendRequest() {
        return userSocialBuilder({
            ...snapshot,
            friendRequests: [],
        })
    },
    withFriendRequest(request: FriendRequest) {
        return userSocialBuilder({
            ...snapshot,
            friendRequests: [...snapshot.friendRequests, request.snapshot],
        })
    },
    build() {
        return UserSocial.fromSnapshot(snapshot)
    },
})
