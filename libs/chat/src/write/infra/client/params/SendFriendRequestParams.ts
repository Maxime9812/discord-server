import { IsUUID } from 'class-validator'

export class SendFriendRequestParams {
    @IsUUID()
    requestId: string
}
