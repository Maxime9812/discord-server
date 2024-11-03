import { FriendRequest } from '../../domain'
import { FriendRequestNotifier } from '../../gateways'

export class StubFriendRequestNotifier implements FriendRequestNotifier {
    lastFriendRequestReceived: FriendRequest
    lastFriendRequestAccepted: string

    async notifyFriendRequestReceived(
        friendRequest: FriendRequest
    ): Promise<void> {
        this.lastFriendRequestReceived = friendRequest
    }

    async notifyFriendRequestAccepted(userId: string): Promise<void> {
        this.lastFriendRequestAccepted = userId
    }
}
