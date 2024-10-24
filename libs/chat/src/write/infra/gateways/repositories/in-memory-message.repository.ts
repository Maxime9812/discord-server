import { Message, MessageSnapshot } from '@app/chat/write/domain'
import { MessageRepository } from '@app/chat/write/gateways'

export class InMemoryMessageRepository implements MessageRepository {
    private messages: Map<string, MessageSnapshot> = new Map()

    async byId(id: string) {
        const snapshot = this.messages.get(id)
        if (snapshot) {
            return Message.fromSnapshot(snapshot)
        }
    }

    async save(message: Message): Promise<void> {
        this.messages.set(message.id, message.snapshot)
    }

    getAll() {
        return Array.from(this.messages.values())
    }

    givenMessages(messages: Message[]) {
        messages.forEach((message) => {
            this.messages.set(message.id, message.snapshot)
        })
    }
}
