import { CommandHandler } from '@app/shared'
import {
    SendDirectMessageCommand,
    SendDirectMessagePayload,
} from './send-direct-message.command'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { DateProvider } from '../../domain'

export class SendDirectMessageHandler
    implements CommandHandler<SendDirectMessageCommand>
{
    constructor(
        private messageRepository: MessageRepository,
        private chatterRepository: ChatterRepository,
        private dateProvider: DateProvider
    ) {}

    async handle(command: SendDirectMessagePayload): Promise<void> {
        const [chatter, receiver] = await Promise.all([
            this.chatterRepository.byId(command.emitterId),
            this.chatterRepository.byId(command.receiverId),
        ])

        const message = chatter.write(receiver, {
            id: command.messageId,
            content: command.content,
            currentDate: this.dateProvider.getNow(),
        })

        await this.messageRepository.save(message)
    }
}
