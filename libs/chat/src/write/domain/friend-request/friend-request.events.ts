import { DomainEvent } from '@app/shared'

export class FriendRequestSentEvent extends DomainEvent<{
    id: string
    senderId: string
    receiverId: string
    requestedAt: Date
}> {}
