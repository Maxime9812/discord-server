import { IsUUID } from 'class-validator'

export class GetMessagesWithUserParam {
    @IsUUID()
    userId: string
}
