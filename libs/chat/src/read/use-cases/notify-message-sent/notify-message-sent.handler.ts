import { MessageSentEvent } from '@app/chat/write/domain/message/message.events'
import { MessageNotifier } from '../../gateways'

type NotifyMessageSentPayload = {
    event: MessageSentEvent
    userId: string
    notifier: MessageNotifier
}

export class NotifyMessageSent {
    constructor() {}

    async execute({
        event,
        userId,
        notifier,
    }: NotifyMessageSentPayload): Promise<void> {
        if (event.payload.receiverId === userId) {
            await notifier.notify({
                id: event.payload.id,
                emitterId: event.payload.emitterId,
                content: event.payload.content,
                sentAt: event.payload.sendAt,
            })
        }
    }
}
