import { Command } from '@app/shared'

export type SendDirectMessagePayload = {
    messageId: string
    emitterId: string
    receiverId: string
    message: string
}

export class SendDirectMessageCommand extends Command<SendDirectMessagePayload> {}
