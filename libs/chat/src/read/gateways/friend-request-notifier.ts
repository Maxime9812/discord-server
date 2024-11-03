import { FriendRequest } from '../domain'

export type FriendRequestNotifier = {
    notifyFriendRequestReceived: (friendRequest: FriendRequest) => Promise<void>
}
