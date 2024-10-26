import { IsUUID, MaxLength } from 'class-validator'

export class SendDirectMessageBody {
    @IsUUID()
    public receiverId: string

    @MaxLength(500)
    public content: string
}
