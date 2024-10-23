import { Module } from '@nestjs/common'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { InMemoryChatterRepository } from '../gateways/in-memory-chatter.repository'
import { InMemoryMessageRepository } from '../gateways/in-memory-message.repository'
import { DateProvider, DeterministicDateProvider } from '../../domain'

@Module({
    providers: [
        {
            provide: ChatterRepository,
            useFactory() {
                return new InMemoryChatterRepository()
            },
        },
        {
            provide: MessageRepository,
            useFactory() {
                return new InMemoryMessageRepository()
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
