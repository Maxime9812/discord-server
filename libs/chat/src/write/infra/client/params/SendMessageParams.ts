import { IsUUID } from 'class-validator'

export class SendMessageParams {
    @IsUUID()
    messageId: string
}
