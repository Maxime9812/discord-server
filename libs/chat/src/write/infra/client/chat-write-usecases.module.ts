import { Module } from '@nestjs/common'
import {
    SendDirectMessageCommand,
    SendDirectMessageHandler,
} from '../../use-cases'
import { CommandBus } from '@app/shared'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { DateProvider } from '../../domain'
import { ChatWriteDependenciesModule } from './chat-write-dependencies.module'

@Module({
    imports: [ChatWriteDependenciesModule],
    providers: [
        {
            provide: SendDirectMessageHandler,
            inject: [ChatterRepository, MessageRepository, DateProvider],
            useFactory(
                chatterRepository: ChatterRepository,
                messageRepository: MessageRepository,
                DateProvider: DateProvider
            ) {
                return new SendDirectMessageHandler(
                    messageRepository,
                    chatterRepository,
                    DateProvider
                )
            },
        },
    ],
})
export class ChatWriteUsecasesModule {
    constructor(
        commandBus: CommandBus,
        sendDirectMessageHandler: SendDirectMessageHandler
    ) {
        commandBus.registerHandler(
            SendDirectMessageCommand,
            sendDirectMessageHandler
        )
    }
}
