import { FriendRequestAcceptedEvent } from '@app/chat/write/domain'
import { FriendRequestNotifier } from '../../gateways'

export type NotifyFriendRequestAcceptedPayload = {
    event: FriendRequestAcceptedEvent
    userId: string
    notifier: FriendRequestNotifier
}

export class NotifyFriendRequestAcceptedHandler {
    async execute({
        event: { payload: friendRequest },
        userId,
        notifier,
    }: NotifyFriendRequestAcceptedPayload) {
        if (userId !== friendRequest.senderId) return
        notifier.notifyFriendRequestAccepted(friendRequest.receiverId)
    }
}
