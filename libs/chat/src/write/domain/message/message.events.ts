import { DomainEvent } from '@app/shared/events/event-bus'

export class MessageSentEvent extends DomainEvent<{
    id: string
    content: string
    receiverId: string
    emitterId: string
    sendAt: Date
}> {}
