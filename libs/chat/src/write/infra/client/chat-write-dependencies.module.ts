import { Module } from '@nestjs/common'
import {
    ChatterRepository,
    MessageRepository,
    UserSocialRepository,
} from '../../gateways'
import { DateProvider, DeterministicDateProvider } from '../../domain'
import { Knex } from 'knex'
import { DatabaseModule, SqlConnection } from '@app/shared'
import {
    InMemoryUserSocialRepository,
    KnexChatterRepository,
    KnexMessageRepository,
} from '../gateways'

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: ChatterRepository,
            inject: [SqlConnection],
            useFactory(knex: Knex) {
                return new KnexChatterRepository(knex)
            },
        },
        {
            provide: MessageRepository,
            inject: [SqlConnection],
            useFactory(knex: Knex) {
                return new KnexMessageRepository(knex)
            },
        },
        {
            provide: DateProvider,
            useFactory() {
                return new DeterministicDateProvider()
            },
        },
        {
            provide: UserSocialRepository,
            useFactory() {
                return new InMemoryUserSocialRepository()
            },
        },
    ],
    exports: [
        ChatterRepository,
        MessageRepository,
        DateProvider,
        UserSocialRepository,
    ],
})
export class ChatWriteDependenciesModule {}
