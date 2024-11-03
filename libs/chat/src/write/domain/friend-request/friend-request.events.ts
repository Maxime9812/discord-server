import { DomainEvent } from '@app/shared'

export class FriendRequestSentEvent extends DomainEvent<{
    id: string
    senderId: string
    receiverId: string
    requestedAt: Date
}> {}

export class FriendRequestAcceptedEvent extends DomainEvent<{
    senderId: string
    receiverId: string
}> {}
