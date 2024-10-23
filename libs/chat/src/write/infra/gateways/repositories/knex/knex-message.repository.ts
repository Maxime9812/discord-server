import { Message } from '@app/chat/write/domain'
import { MessageRepository } from '@app/chat/write/gateways'
import { Knex } from 'knex'
import { MessagePm } from './persistence-models/message.pm'

export class KnexMessageRepository implements MessageRepository {
    constructor(private knex: Knex) {}

    async byId(id: string): Promise<Message | undefined> {
        const message = await this.knex<MessagePm>('messages')
            .where('id', id)
            .first()
        if (!message) return

        return KnexMessageRepository.toDomain(message)
    }

    async save(message: Message): Promise<void> {
        await this.knex('messages')
            .insert(KnexMessageRepository.toPersistence(message))
            .onConflict('id')
            .merge()
    }

    private static toDomain(message: MessagePm): Message {
        return Message.fromSnapshot({
            id: message.id,
            emitterId: message.emitter_id,
            receiverId: message.receiver_id,
            content: message.content,
            sendAt: message.send_at,
            deleted: message.deleted,
        })
    }

    private static toPersistence(message: Message): MessagePm {
        const snapshot = message.snapshot
        return {
            id: snapshot.id,
            emitter_id: snapshot.emitterId,
            receiver_id: snapshot.receiverId,
            content: snapshot.content,
            send_at: snapshot.sendAt,
            deleted: snapshot.deleted,
        }
    }
}
