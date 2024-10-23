import { CommandHandler, DomainError } from '@app/shared'
import {
    SendDirectMessageCommand,
    SendDirectMessagePayload,
} from './send-direct-message.command'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { DateProvider } from '../../domain'

export class ChatterNotFoundError extends DomainError {
    constructor(chatterId: string) {
        super(`Chatter with id ${chatterId} not found`)
    }
}

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
