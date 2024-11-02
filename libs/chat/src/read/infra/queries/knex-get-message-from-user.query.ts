import { Knex } from 'knex'
import { GetMessagesFromUserQuery } from '../../queries'
import { MessagePm } from '@app/chat/write'

export class KnexGetMessagesFromUserQuery implements GetMessagesFromUserQuery {
    constructor(private knex: Knex) {}

    async execute(userId: string, userId2: string) {
        const messages = await this.knex<MessagePm>('messages')
            .select('id', 'emitter_id', 'content', 'send_at')
            .where('emitter_id', userId)
            .orWhere('emitter_id', userId2)
            .orderBy('send_at', 'desc')

        return messages.map((message) => ({
            id: message.id,
            emitterId: message.emitter_id,
            content: message.content,
            sendAt: message.send_at,
        }))
    }
}
