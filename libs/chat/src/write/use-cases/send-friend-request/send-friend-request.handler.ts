import { CommandHandler, EventBus } from '@app/shared'
import {
    SendFriendRequestCommand,
    SendFriendRequestPaylaod,
} from './send-friend-request.command'
import {
    DateProvider,
    FriendRequestSentEvent,
    UserSocialNotFoundError,
} from '../../domain'
import { UserSocialRepository } from '../../gateways'

export class SendFriendRequestHandler
    implements CommandHandler<SendFriendRequestCommand>
{
    constructor(
        private userSocialRepository: UserSocialRepository,
        private dateProvider: DateProvider,
        private eventBus: EventBus
    ) {}

    async handle(command: SendFriendRequestPaylaod): Promise<void> {
        const sender = await this.getUserSocial(command.senderId)
        const receiver = await this.getUserSocial(command.receiverId)

        sender.requestToBeFriendWith(receiver, {
            id: command.requestId,
            currentDate: this.dateProvider.getNow(),
        })

        await this.userSocialRepository.save(sender)
        this.eventBus.emit(
            new FriendRequestSentEvent({
                id: command.requestId,
                senderId: command.senderId,
                receiverId: command.receiverId,
                requestedAt: this.dateProvider.getNow(),
            })
        )
    }

    private async getUserSocial(id: string) {
        const userSocial = await this.userSocialRepository.byId(id)

        if (!userSocial) {
            throw new UserSocialNotFoundError(id)
        }

        return userSocial
    }
}
