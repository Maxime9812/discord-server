import { Module } from '@nestjs/common'
import {
    NotificationsController,
    ReadMessagesController,
    ReadSocialController,
} from './controllers'
import {
    NotifyFriendRequestAcceptedHandler,
    NotifyMessageSent,
} from '../use-cases'
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
import { NotifyFriendRequestReceivedHandler } from '../use-cases/notify-friend-request-received/notify-friend-request-received.handler'

@Module({
    imports: [DatabaseModule],
    controllers: [
        ReadMessagesController,
        ReadSocialController,
        NotificationsController,
    ],
    providers: [
        {
            provide: NotifyMessageSent,
            useClass: NotifyMessageSent,
        },
        {
            provide: NotifyFriendRequestReceivedHandler,
            useClass: NotifyFriendRequestReceivedHandler,
        },
        {
            provide: NotifyFriendRequestAcceptedHandler,
            useClass: NotifyFriendRequestAcceptedHandler,
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
