import { Controller, Get, Param, Inject } from '@nestjs/common'
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger'
import { GetMessagesWithUserParam } from '../params'
import { AuthUser, User } from '@app/iam'
import { GetMessagesFromUserQuery } from '../../queries'

@Controller('messages')
@ApiTags('Chat')
@ApiCookieAuth()
export class ReadMessagesController {
    constructor(
        @Inject(GetMessagesFromUserQuery)
        private getMessagesFromUserQuery: GetMessagesFromUserQuery
    ) {}

    @Get(':userId')
    async getMessagesWithUser(
        @User() user: AuthUser,
        @Param() params: GetMessagesWithUserParam
    ) {
        return this.getMessagesFromUserQuery.execute(user.id, params.userId)
    }
}
