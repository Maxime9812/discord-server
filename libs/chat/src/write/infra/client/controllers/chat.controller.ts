import {
    DeleteDirectMessageCommand,
    SendDirectMessageCommand,
} from '@app/chat/write/use-cases'
import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import { SendDirectMessageDTO } from '../dtos'
import { DeleteMessageParams, SendMessageParams } from '../params'
import { CommandBus } from '@app/shared'

@Controller('chat')
export class ChatController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post('/:messageId/send')
    async sendMessage(
        @Body() payload: SendDirectMessageDTO,
        @Param() params: SendMessageParams
    ) {
        await this.commandBus.execute(
            new SendDirectMessageCommand({
                messageId: params.messageId,
                emitterId: '1',
                receiverId: payload.receiverId,
                content: payload.content,
            })
        )
    }

    @Delete('/:messageId')
    async deleteMessage(@Param() params: DeleteMessageParams) {
        await this.commandBus.execute(
            new DeleteDirectMessageCommand({
                id: params.messageId,
                chatterId: '1',
            })
        )
    }
}
