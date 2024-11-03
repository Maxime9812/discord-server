import { FriendRequest } from '../../domain'
import { FriendRequestNotifier } from '../../gateways'

export class StubFriendRequestNotifier implements FriendRequestNotifier {
    lastNotification: FriendRequest

    async notifyFriendRequestReceived(
        friendRequest: FriendRequest
    ): Promise<void> {
        this.lastNotification = friendRequest
    }
}
