import { SendDirectMessageCommand } from '@app/chat/write/use-cases'
import { CommandBus } from '@app/shared/commands/command-bus'
import { Controller, Post } from '@nestjs/common'

@Controller('chat')
export class ChatController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post('/send-message')
    async sendMessage() {
        await this.commandBus.execute(
            new SendDirectMessageCommand({
                messageId: '1',
                emitterId: '1',
                receiverId: '2',
                content: 'Hello world !',
            })
        )
    }
}
