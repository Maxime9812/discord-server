import { CommandHandler, EventBus } from '@app/shared'
import {
    SendDirectMessageCommand,
    SendDirectMessagePayload,
} from './send-direct-message.command'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { ChatterNotFoundError, DateProvider } from '../../domain'
import { MessageSentEvent } from '../../domain/message/message.events'

export class SendDirectMessageHandler
    implements CommandHandler<SendDirectMessageCommand>
{
    constructor(
        private messageRepository: MessageRepository,
        private chatterRepository: ChatterRepository,
        private dateProvider: DateProvider,
        private eventBus: EventBus
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
        chatter.getDomainEvents().forEach((event) => this.eventBus.emit(event))
    }

    private async getChatter(chatterId: string) {
        const chatter = await this.chatterRepository.byId(chatterId)
        if (!chatter) {
            throw new ChatterNotFoundError(chatterId)
        }

        return chatter
    }
}
