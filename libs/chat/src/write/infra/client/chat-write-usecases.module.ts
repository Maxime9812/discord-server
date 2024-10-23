import { Module } from '@nestjs/common'
import {
    SendDirectMessageCommand,
    SendDirectMessageHandler,
    SendFriendRequestCommand,
    SendFriendRequestHandler,
} from '../../use-cases'
import { CommandBus } from '@app/shared'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { DateProvider } from '../../domain'
import { ChatWriteDependenciesModule } from './chat-write-dependencies.module'
import { DeleteDirectMessageHandler } from '../../use-cases/delete-direct-message/delete-direct-message.handler'
import { DeleteDirectMessageCommand } from '../../use-cases/delete-direct-message/delete-direct-message.command'

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
        {
            provide: DeleteDirectMessageHandler,
            inject: [ChatterRepository, MessageRepository],
            useFactory(
                chatterRepository: ChatterRepository,
                messageRepository: MessageRepository
            ) {
                return new DeleteDirectMessageHandler(
                    messageRepository,
                    chatterRepository
                )
            },
        },
        {
            provide: SendFriendRequestHandler,
            useFactory() {
                return new SendFriendRequestHandler()
            },
        },
    ],
})
export class ChatWriteUsecasesModule {
    constructor(
        commandBus: CommandBus,
        sendDirectMessageHandler: SendDirectMessageHandler,
        deleteDirectMessageHandler: DeleteDirectMessageHandler,
        sendFriendRequestHandler: SendFriendRequestHandler
    ) {
        commandBus
            .registerHandler(SendDirectMessageCommand, sendDirectMessageHandler)
            .registerHandler(
                DeleteDirectMessageCommand,
                deleteDirectMessageHandler
            )
            .registerHandler(SendFriendRequestCommand, sendFriendRequestHandler)
    }
}
