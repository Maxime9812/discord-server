import {
    DeleteDirectMessageCommand,
    SendDirectMessageCommand,
} from '@app/chat/write/use-cases'
import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import { DeleteMessageParams, SendMessageParams } from '../params'
import { CommandBus } from '@app/shared'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { SendDirectMessageBody } from '../body'

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
export class ChatController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post('/:messageId/send')
    async sendMessage(
        @Body() payload: SendDirectMessageBody,
        @Param() params: SendMessageParams
    ) {
        await this.commandBus.execute(
            new SendDirectMessageCommand({
                messageId: params.messageId,
                emitterId: '0c16374a-f2fd-4bd1-9304-296601013047',
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
                chatterId: '0c16374a-f2fd-4bd1-9304-296601013047',
            })
        )
    }
}
