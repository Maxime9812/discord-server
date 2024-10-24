import { FriendRequest, UserSocial, UserSocialSnapshot } from '../domain'

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
    withFriend(friend: string) {
        return userSocialBuilder({
            ...snapshot,
            friends: [...snapshot.friends, friend],
        })
    },
    withoutFriend() {
        return userSocialBuilder({
            ...snapshot,
            friends: [],
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
