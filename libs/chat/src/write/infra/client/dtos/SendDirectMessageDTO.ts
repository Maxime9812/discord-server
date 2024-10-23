import { IsUUID, MaxLength } from 'class-validator'

export class SendDirectMessageDTO {
    @IsUUID()
    public receiverId: string

    @MaxLength(500)
    public content: string
}
