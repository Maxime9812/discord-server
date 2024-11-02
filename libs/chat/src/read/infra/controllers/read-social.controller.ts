import { AuthUser, User } from '@app/iam'
import { Controller, Get, Inject } from '@nestjs/common'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { GetFriendRequestsQuery } from '../../queries'

@Controller('social')
@ApiTags('Social')
@ApiCookieAuth()
export class ReadSocialController {
    constructor(
        @Inject(GetFriendRequestsQuery)
        private getFriendsRequestQuery: GetFriendRequestsQuery
    ) {}

    @Get('friend-requests')
    async getFriendRequests(@User() user: AuthUser) {
        return this.getFriendsRequestQuery.execute(user.id)
    }
}
