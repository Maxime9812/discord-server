import { CommandBus } from '@app/shared'
import { Body, Controller, Param, Post } from '@nestjs/common'
import { SendFriendRequestBody } from '../dtos'
import {
    AcceptFriendRequestCommand,
    SendFriendRequestCommand,
} from '@app/chat/write/use-cases'
import { SendFriendRequestParams } from '../params'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Social')
@Controller('social')
export class SocialController {
    constructor(private commandBus: CommandBus) {}

    @Post('/friend-request/:requestId')
    async sendFriendRequest(
        @Body() body: SendFriendRequestBody,
        @Param() params: SendFriendRequestParams
    ) {
        await this.commandBus.execute(
            new SendFriendRequestCommand({
                requestId: params.requestId,
                senderId: '0c16374a-f2fd-4bd1-9304-296601013047',
                receiverId: body.receiverId,
            })
        )
    }

    @Post('/friend-request/:requestId/accept')
    async acceptFriendRequest(@Param() params: SendFriendRequestParams) {
        await this.commandBus.execute(
            new AcceptFriendRequestCommand({
                requestId: params.requestId,
                userId: '49001600-3501-4824-a6f3-3bf882e7f7db',
            })
        )
    }
}
