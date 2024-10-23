import { Command } from '@app/shared'

export type SendDirectMessagePayload = {
    to: string
    message: string
}

export class SendDirectMessageCommand extends Command<SendDirectMessagePayload> {}
