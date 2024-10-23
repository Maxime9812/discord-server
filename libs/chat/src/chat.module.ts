import { CommandBus } from '@app/shared/commands/command-bus'
import { Module } from '@nestjs/common'
import { ChatController } from './write/infra/client/controllers/chat.controller'
import {
    SendDirectMessageCommand,
    SendDirectMessageHandler,
} from './write/use-cases'

@Module({
    providers: [
        {
            provide: SendDirectMessageHandler,
            useClass: SendDirectMessageHandler,
        },
    ],
    controllers: [ChatController],
    exports: [],
})
export class ChatModule {
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
