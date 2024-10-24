import { Module } from '@nestjs/common'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { DateProvider, DeterministicDateProvider } from '../../domain'
import { Knex } from 'knex'
import { DatabaseModule, SqlConnection } from '@app/shared'
import { InMemoryChatterRepository, KnexMessageRepository } from '../gateways'

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: ChatterRepository,
            useFactory() {
                return new InMemoryChatterRepository()
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
    ],
    exports: [ChatterRepository, MessageRepository, DateProvider],
})
export class ChatWriteDependenciesModule {}
