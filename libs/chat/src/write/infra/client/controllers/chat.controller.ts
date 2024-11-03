import {
    DeleteDirectMessageHandler,
    SendDirectMessageHandler,
} from '@app/chat/write/use-cases'
import {
    Body,
    Controller,
    Delete,
    NotFoundException,
    BadRequestException,
    Param,
    Post,
} from '@nestjs/common'
import { DeleteMessageParams, SendMessageParams } from '../params'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { SendDirectMessageBody } from '../body'
import { AuthUser, User } from '@app/iam'
import {
    ChatterNotFoundError,
    ChatterNotFriendWithReceiverError,
    MessageAlreadyDeletedError,
    MessageNotFoundError,
    MessageWasNotSentByChatterError,
} from '@app/chat/write/domain'

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
        try {
            await this.sendDirectMessageHandler.handle({
                messageId: params.messageId,
                emitterId: user.id,
                receiverId: payload.receiverId,
                content: payload.content,
            })
        } catch (error) {
            if (error instanceof ChatterNotFoundError)
                throw new NotFoundException(error.message)
            if (error instanceof ChatterNotFriendWithReceiverError)
                throw new BadRequestException(error.message)
            throw error
        }
    }

    @Delete('/:messageId')
    async deleteMessage(
        @Param() params: DeleteMessageParams,
        @User() user: AuthUser
    ) {
        try {
            await this.deleteMessageHandler.handle({
                id: params.messageId,
                chatterId: user.id,
            })
        } catch (error) {
            if (error instanceof ChatterNotFoundError)
                throw new NotFoundException(error.message)
            if (error instanceof MessageNotFoundError)
                throw new NotFoundException(error.message)
            if (error instanceof MessageWasNotSentByChatterError)
                throw new BadRequestException(error.message)
            if (error instanceof MessageAlreadyDeletedError)
                throw new BadRequestException(error.message)
            throw error
        }
    }
}
