import { FriendRequestSentEvent } from '@app/chat/write/domain'
import { FriendRequestNotifier } from '../../gateways'

export type NotifyFriendRequestReceivedPayload = {
    event: FriendRequestSentEvent
    userId: string
    notifier: FriendRequestNotifier
}

export class NotifyFriendRequestReceivedHandler {
    async execute({
        event: { payload: friendRequest },
        userId,
        notifier,
    }: NotifyFriendRequestReceivedPayload) {
        if (userId !== friendRequest.receiverId) return

        notifier.notifyFriendRequestReceived({
            id: friendRequest.id,
            senderId: friendRequest.senderId,
            requestedAt: friendRequest.requestedAt,
        })
    }
}
