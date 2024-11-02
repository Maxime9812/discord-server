import { AuthUser, User } from '@app/iam'
import { Controller, Get } from '@nestjs/common'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'

@Controller('social')
@ApiTags('Social')
@ApiCookieAuth()
export class ReadSocialController {
    constructor() {}

    @Get('friend-requests')
    async getFriendRequests(@User() user: AuthUser) {
        return []
    }
}
