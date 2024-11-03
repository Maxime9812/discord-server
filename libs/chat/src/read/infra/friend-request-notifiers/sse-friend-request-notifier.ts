import { Subject } from 'rxjs'
import { FriendRequest } from '../../domain'
import { FriendRequestNotifier } from '../../gateways'
import { MessageEvent } from '@nestjs/common'

export class SSEFriendRequestNotifier implements FriendRequestNotifier {
    constructor(private subject: Subject<MessageEvent>) {}

    async notifyFriendRequestReceived(
        friendRequest: FriendRequest
    ): Promise<void> {
        this.subject.next({
            type: 'friend-request-received',
            data: friendRequest,
        })
    }

    async notifyFriendRequestAccepted(userId: string): Promise<void> {
        this.subject.next({
            type: 'friend-request-accepted',
            data: { userId },
        })
    }
}
