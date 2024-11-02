import { AuthUser, User } from '@app/iam'
import { Controller, Get, Inject } from '@nestjs/common'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { GetFriendRequestsQuery, GetFriendsQuery } from '../../queries'

@Controller('social')
@ApiTags('Social')
@ApiCookieAuth()
export class ReadSocialController {
    constructor(
        @Inject(GetFriendRequestsQuery)
        private getFriendsRequestQuery: GetFriendRequestsQuery,
        @Inject(GetFriendsQuery)
        private getFriendsQuery: GetFriendsQuery
    ) {}

    @Get('friend-requests')
    getFriendRequests(@User() user: AuthUser) {
        return this.getFriendsRequestQuery.execute(user.id)
    }

    @Get('friends')
    getFriends(@User() user: AuthUser) {
        return this.getFriendsQuery.execute(user.id)
    }
}
