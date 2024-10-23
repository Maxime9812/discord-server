import { CommandHandler } from '@app/shared'
import {
    DeleteDirectMessageCommand,
    DeleteDirectMessagePayload,
} from './delete-direct-message.command'
import { ChatterRepository, MessageRepository } from '../../gateways'
import { MessageNotFoundError } from './delete-direct-message.errors'

export class DeleteDirectMessageHandler
    implements CommandHandler<DeleteDirectMessageCommand>
{
    constructor(
        private messageRepository: MessageRepository,
        private chatterRepository: ChatterRepository
    ) {}

    async handle(command: DeleteDirectMessagePayload) {
        const message = await this.messageRepository.byId(command.id)
        if (!message) {
            throw new MessageNotFoundError(command.id)
        }
        const chatter = await this.chatterRepository.byId(command.chatterId)

        message.delete(chatter)

        await this.messageRepository.save(message)
    }
}
