import { Message, MessageSnapshot } from '../../domain'

export const messageBuilder = (
    snapshot: MessageSnapshot = {
        id: 'message-id',
        emitterId: 'emitter-id',
        receiverId: 'receiver-id',
        content: 'message-content',
        sendAt: new Date('2024-10-23'),
        deleted: false,
    }
) => ({
    withId(id: string) {
        return messageBuilder({ ...snapshot, id })
    },
    withContent(content: string) {
        return messageBuilder({ ...snapshot, content })
    },
    withEmitterId(emitterId: string) {
        return messageBuilder({ ...snapshot, emitterId })
    },
    withReceiverId(receiverId: string) {
        return messageBuilder({ ...snapshot, receiverId })
    },
    sendAt(date: Date) {
        return messageBuilder({ ...snapshot, sendAt: date })
    },
    deleted() {
        return messageBuilder({ ...snapshot, deleted: true })
    },
    build() {
        return Message.fromSnapshot(snapshot)
    },
})
