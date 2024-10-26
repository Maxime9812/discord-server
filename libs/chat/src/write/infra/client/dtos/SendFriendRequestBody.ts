import { IsUUID } from 'class-validator'

export class SendFriendRequestBody {
    @IsUUID()
    receiverId: string
}
