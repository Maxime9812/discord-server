import { CommandHandler } from '@app/shared'
import {
    SendDirectMessageCommand,
    SendDirectMessagePayload,
} from './send-direct-message.command'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { ChatterNotFoundError, DateProvider } from '../../domain'

export class SendDirectMessageHandler
    implements CommandHandler<SendDirectMessageCommand>
{
    constructor(
        private messageRepository: MessageRepository,
        private chatterRepository: ChatterRepository,
        private dateProvider: DateProvider
    ) {}

    async handle(command: SendDirectMessagePayload): Promise<void> {
        const chatter = await this.getChatter(command.emitterId)
        const receiver = await this.getChatter(command.receiverId)

        const message = chatter.write(receiver, {
            id: command.messageId,
            content: command.content,
            currentDate: this.dateProvider.getNow(),
        })

        await this.messageRepository.save(message)
    }

    private async getChatter(chatterId: string) {
        const chatter = await this.chatterRepository.byId(chatterId)
        if (!chatter) {
            throw new ChatterNotFoundError(chatterId)
        }

        return chatter
    }
}
