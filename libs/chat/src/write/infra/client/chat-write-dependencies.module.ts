import { Module } from '@nestjs/common'
import {
    ChatterRepository,
    MessageRepository,
    UserSocialRepository,
} from '../../gateways'
import { DateProvider, RealDateProvider } from '../../domain'
import { Knex } from 'knex'
import { DatabaseModule, SqlConnection } from '@app/shared'
import { KnexChatterRepository, KnexMessageRepository } from '../gateways'
import { KnexUserSocialRepository } from '../gateways/repositories/knex/knex-user-social.repository'

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
                return new RealDateProvider()
            },
        },
        {
            provide: UserSocialRepository,
            inject: [SqlConnection],

            useFactory(knex: Knex) {
                return new KnexUserSocialRepository(knex)
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
