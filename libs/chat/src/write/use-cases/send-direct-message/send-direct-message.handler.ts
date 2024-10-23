import { CommandHandler } from '@app/shared'
import {
    SendDirectMessageCommand,
    SendDirectMessagePayload,
} from './send-direct-message.command'

export class SendDirectMessageHandler
    implements CommandHandler<SendDirectMessageCommand>
{
    async handle(command: SendDirectMessagePayload): Promise<void> {
        console.log('Sending direct message', command)
    }
}
