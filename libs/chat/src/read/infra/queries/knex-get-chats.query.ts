import { Knex } from 'knex'
import { GetChatsQuery } from '../../queries'
import { MessagePm } from '@app/chat/write'

export class KnexGetChatsQuery implements GetChatsQuery {
    constructor(private knex: Knex) {}

    async execute(userId: string) {
        const chats = await this.knex<MessagePm>('messages')
            .select(
                this.knex.raw(
                    'CASE WHEN emitter_id = ? THEN receiver_id ELSE emitter_id END AS user2',
                    [userId]
                ),
                this.knex.raw(
                    'CASE WHEN emitter_id = ? THEN emitter_id ELSE receiver_id END AS user1',
                    [userId]
                )
            )
            .where('emitter_id', userId)
            .orWhere('receiver_id', userId)
            .groupBy('user1', 'user2')

        return chats.map((chat: any) => ({
            chatterId: userId == chat.user1 ? chat.user2 : chat.user1,
        }))
    }
}
