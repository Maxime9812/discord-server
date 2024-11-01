import {
    DeleteDirectMessageHandler,
    SendDirectMessageHandler,
} from '@app/chat/write/use-cases'
import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import { DeleteMessageParams, SendMessageParams } from '../params'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { SendDirectMessageBody } from '../body'
import { AuthUser, User } from '@app/iam'

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
export class ChatController {
    constructor(
        private sendDirectMessageHandler: SendDirectMessageHandler,
        private deleteMessageHandler: DeleteDirectMessageHandler
    ) {}

    @Post('/:messageId/send')
    async sendMessage(
        @Body() payload: SendDirectMessageBody,
        @Param() params: SendMessageParams,
        @User() user: AuthUser
    ) {
        await this.sendDirectMessageHandler.handle({
            messageId: params.messageId,
            emitterId: user.id,
            receiverId: payload.receiverId,
            content: payload.content,
        })
    }

    @Delete('/:messageId')
    async deleteMessage(
        @Param() params: DeleteMessageParams,
        @User() user: AuthUser
    ) {
        await this.deleteMessageHandler.handle({
            id: params.messageId,
            chatterId: user.id,
        })
    }
}
