import { CommandHandler } from '@app/shared'
import {
    AcceptFriendRequestCommand,
    AcceptFriendRequestPayload,
} from './accept-friend-request.command'
import { UserSocialRepository } from '../../gateways'
import { DateProvider } from '../../domain'

export class AcceptFriendRequestHandler
    implements CommandHandler<AcceptFriendRequestCommand>
{
    constructor(
        private userSocialRepository: UserSocialRepository,
        private dateProvider: DateProvider
    ) {}

    async handle(command: AcceptFriendRequestPayload): Promise<void> {
        const user = await this.userSocialRepository.byId(command.userId)

        user.acceptFriendRequest(command.requestId, this.dateProvider.getNow())

        await this.userSocialRepository.save(user)
    }
}
