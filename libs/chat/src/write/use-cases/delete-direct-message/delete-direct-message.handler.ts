import { CommandHandler } from '@app/shared'
import {
    DeleteDirectMessageCommand,
    DeleteDirectMessagePayload,
} from './delete-direct-message.command'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { ChatterNotFoundError, MessageNotFoundError } from '../../domain'

export class DeleteDirectMessageHandler
    implements CommandHandler<DeleteDirectMessageCommand>
{
    constructor(
        private messageRepository: MessageRepository,
        private chatterRepository: ChatterRepository
    ) {}

    async handle(command: DeleteDirectMessagePayload) {
        const message = await this.getMessage(command.id)
        const chatter = await this.getChatter(command.chatterId)

        message.delete(chatter)

        await this.messageRepository.save(message)
    }

    private async getMessage(messageId: string) {
        const message = await this.messageRepository.byId(messageId)
        if (!message) {
            throw new MessageNotFoundError(messageId)
        }
        return message
    }

    private async getChatter(chatterId: string) {
        const chatter = await this.chatterRepository.byId(chatterId)
        if (!chatter) {
            throw new ChatterNotFoundError(chatterId)
        }
        return chatter
    }
}
