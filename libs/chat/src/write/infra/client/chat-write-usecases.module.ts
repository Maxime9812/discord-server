import { Module } from '@nestjs/common'
import {
    AcceptFriendRequestHandler,
    SendDirectMessageHandler,
    SendFriendRequestHandler,
} from '../../use-cases'
import {
    ChatterRepository,
    MessageRepository,
    UserSocialRepository,
} from '../../gateways'
import { DateProvider } from '../../domain'
import { ChatWriteDependenciesModule } from './chat-write-dependencies.module'
import { DeleteDirectMessageHandler } from '../../use-cases/delete-direct-message/delete-direct-message.handler'
import { EventBus } from '@app/shared'

@Module({
    imports: [ChatWriteDependenciesModule],
    providers: [
        {
            provide: SendDirectMessageHandler,
            inject: [
                ChatterRepository,
                MessageRepository,
                DateProvider,
                EventBus,
            ],
            useFactory(
                chatterRepository: ChatterRepository,
                messageRepository: MessageRepository,
                DateProvider: DateProvider,
                eventBus: EventBus
            ) {
                return new SendDirectMessageHandler(
                    messageRepository,
                    chatterRepository,
                    DateProvider,
                    eventBus
                )
            },
        },
        {
            provide: DeleteDirectMessageHandler,
            inject: [ChatterRepository, MessageRepository],
            useFactory(
                chatterRepository: ChatterRepository,
                messageRepository: MessageRepository
            ) {
                return new DeleteDirectMessageHandler(
                    messageRepository,
                    chatterRepository
                )
            },
        },
        {
            provide: SendFriendRequestHandler,
            inject: [UserSocialRepository, DateProvider],
            useFactory(
                userSocialRepository: UserSocialRepository,
                DateProvider: DateProvider
            ) {
                return new SendFriendRequestHandler(
                    userSocialRepository,
                    DateProvider
                )
            },
        },
        {
            provide: AcceptFriendRequestHandler,
            inject: [UserSocialRepository, DateProvider],
            useFactory(
                userSocialRepository: UserSocialRepository,
                dateProvider: DateProvider
            ) {
                return new AcceptFriendRequestHandler(
                    userSocialRepository,
                    dateProvider
                )
            },
        },
    ],
    exports: [
        SendDirectMessageHandler,
        DeleteDirectMessageHandler,
        SendFriendRequestHandler,
        AcceptFriendRequestHandler,
    ],
})
export class ChatWriteUsecasesModule {}
