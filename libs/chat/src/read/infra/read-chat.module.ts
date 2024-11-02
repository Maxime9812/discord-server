import { Module } from '@nestjs/common'
import { ReadMessagesController, ReadSocialController } from './controllers'
import { NotifyMessageSent } from '../use-cases'
import {
    GetChatsQuery,
    GetFriendRequestsQuery,
    GetFriendsQuery,
    GetMessagesFromUserQuery,
} from '../queries'
import { DatabaseModule, SqlConnection } from '@app/shared'
import { Knex } from 'knex'
import { KnexGetMessagesFromUserQuery } from './queries'
import { KnexGetFriendRequestsQuery } from './queries/knex-get-friend-requests.query'
import { KnexGetChatsQuery } from './queries/knex-get-chats.query'
import { KnexGetFriendsQuery } from './queries/knex-get-friends.query'

@Module({
    imports: [DatabaseModule],
    controllers: [ReadMessagesController, ReadSocialController],
    providers: [
        {
            provide: NotifyMessageSent,
            useClass: NotifyMessageSent,
        },
        {
            provide: GetMessagesFromUserQuery,
            inject: [SqlConnection],
            useFactory: (knex: Knex) => new KnexGetMessagesFromUserQuery(knex),
        },
        {
            provide: GetFriendRequestsQuery,
            inject: [SqlConnection],
            useFactory: (knex: Knex) => new KnexGetFriendRequestsQuery(knex),
        },
        {
            provide: GetChatsQuery,
            inject: [SqlConnection],
            useFactory: (knex: Knex) => new KnexGetChatsQuery(knex),
        },
        {
            provide: GetFriendsQuery,
            inject: [SqlConnection],
            useFactory: (knex: Knex) => new KnexGetFriendsQuery(knex),
        },
    ],
})
export class ReadChatModule {}
