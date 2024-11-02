import { Module } from '@nestjs/common'
import { ReadChatController, ReadSocialController } from './controllers'
import { NotifyMessageSent } from '../use-cases'
import { GetMessagesFromUserQuery } from '../queries'
import { DatabaseModule, SqlConnection } from '@app/shared'
import { Knex } from 'knex'
import { KnexGetMessagesFromUserQuery } from './queries'

@Module({
    imports: [DatabaseModule],
    controllers: [ReadChatController, ReadSocialController],
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
    ],
})
export class ReadChatModule {}
