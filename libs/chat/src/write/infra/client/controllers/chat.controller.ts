import { SendDirectMessageCommand } from '@app/chat/write/use-cases'
import { CommandBus } from '@app/shared/commands/command-bus'
import { Body, Controller, Post } from '@nestjs/common'
import { SendDirectMessageDTO } from '../dtos/SendDirectMessageDTO'

@Controller('chat')
export class ChatController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post('/send-message')
    async sendMessage(@Body() payload: SendDirectMessageDTO) {
        await this.commandBus.execute(
            new SendDirectMessageCommand({
                messageId: payload.messageId,
                emitterId: '1',
                receiverId: payload.receiverId,
                content: payload.content,
            })
        )
    }
}
