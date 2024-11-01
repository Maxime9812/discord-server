import { CommandBus } from '@app/shared'
import { Body, Controller, Param, Post } from '@nestjs/common'
import { SendFriendRequestBody } from '../body'
import {
    AcceptFriendRequestCommand,
    AcceptFriendRequestHandler,
    SendFriendRequestCommand,
    SendFriendRequestHandler,
} from '@app/chat/write/use-cases'
import { SendFriendRequestParams } from '../params'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthUser, User } from '@app/iam'

@ApiTags('Social')
@Controller('social')
@ApiBearerAuth()
export class SocialController {
    constructor(
        private sendFriendRequestHandler: SendFriendRequestHandler,
        private acceptFriendRequestHandler: AcceptFriendRequestHandler
    ) {}

    @Post('/friend-request/:requestId')
    async sendFriendRequest(
        @Body() body: SendFriendRequestBody,
        @Param() params: SendFriendRequestParams,
        @User() user: AuthUser
    ) {
        await this.sendFriendRequestHandler.handle({
            requestId: params.requestId,
            senderId: user.id,
            receiverId: body.receiverId,
        })
    }

    @Post('/friend-request/:requestId/accept')
    async acceptFriendRequest(
        @Param() params: SendFriendRequestParams,
        @User() user: AuthUser
    ) {
        await this.acceptFriendRequestHandler.handle({
            requestId: params.requestId,
            userId: user.id,
        })
    }
}
