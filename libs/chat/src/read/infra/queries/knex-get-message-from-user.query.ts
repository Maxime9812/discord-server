import { Knex } from 'knex'
import { GetMessagesFromUserQuery } from '../../queries'
import { MessagePm } from '@app/chat/write'

export class KnexGetMessagesFromUserQuery implements GetMessagesFromUserQuery {
    constructor(private knex: Knex) {}

    execute(userId: string, userId2: string) {
        return this.knex<MessagePm>('messages')
            .select(
                'id',
                'emitter_id as emitterId',
                'receiver_id as receiverId',
                'content',
                'send_at as sendAt'
            )
            .where('emitter_id', userId)
            .andWhere('receiver_id', userId2)
            .orWhere('emitter_id', userId2)
            .andWhere('receiver_id', userId)
            .orderBy('send_at', 'desc')
    }
}
