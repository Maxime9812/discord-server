import { IsUUID } from 'class-validator'

export class DeleteMessageParams {
    @IsUUID()
    messageId: string
}
