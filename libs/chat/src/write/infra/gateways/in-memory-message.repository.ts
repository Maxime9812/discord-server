import { Message, MessageSnapshot } from '../../domain'
import { MessageRepository } from '../../gateways'

export class InMemoryMessageRepository implements MessageRepository {
    private messages: Map<string, MessageSnapshot> = new Map()

    async byId(id: string) {
        const snapshot = this.messages.get(id)!
        return Message.fromSnapshot(snapshot)
    }

    async save(message: Message): Promise<void> {
        this.messages.set(message.id, message.snapshot)
    }

    getAll() {
        return Array.from(this.messages.values())
    }
}
