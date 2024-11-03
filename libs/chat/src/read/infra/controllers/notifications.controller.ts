import { MessageSentEvent } from '@app/chat/write/domain/message/message.events'
import { Controller, Sse, MessageEvent, Res } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Subject } from 'rxjs'
import {
    NotifyFriendRequestReceivedHandler,
    NotifyMessageSent,
} from '../../use-cases'
import { AuthUser, User } from '@app/iam'
import { Response } from 'express'
import { SSEMessageNotifier } from '../message-notifiers'
import { FriendRequestSentEvent } from '@app/chat/write/domain'
import { SSEFriendRequestNotifier } from '../friend-request-notifiers/sse-friend-request-notifier'

@Controller('notifications')
export class NotificationsController {
    constructor(
        private eventBus: EventEmitter2,
        private notifyMessageSent: NotifyMessageSent,
        private notifyFriendRequestSent: NotifyFriendRequestReceivedHandler
    ) {}

    @Sse('')
    async notify(@User() user: AuthUser, @Res() res: Response) {
        const subject = new Subject<MessageEvent>()
        const removeMessageSentListener = this.handleMessageSentEvent(
            subject,
            user.id
        )

        const removeFriendRequestSentListener =
            this.handleFriendRequestSentEvent(subject, user.id)

        res.once('close', () => {
            removeMessageSentListener()
            removeFriendRequestSentListener()
        })

        return subject
    }

    private handleMessageSentEvent(
        subject: Subject<MessageEvent>,
        userId: string
    ) {
        const listener = async (event: MessageSentEvent) => {
            await this.notifyMessageSent.execute({
                event,
                userId,
                notifier: new SSEMessageNotifier(subject),
            })
        }

        this.eventBus.on(MessageSentEvent.name, listener)

        return () => {
            this.eventBus.off(MessageSentEvent.name, listener)
        }
    }

    private handleFriendRequestSentEvent(
        subject: Subject<MessageEvent>,
        userId: string
    ) {
        const listener = async (event: FriendRequestSentEvent) => {
            await this.notifyFriendRequestSent.execute({
                event,
                userId,
                notifier: new SSEFriendRequestNotifier(subject),
            })
        }

        this.eventBus.on(FriendRequestSentEvent.name, listener)

        return () => {
            this.eventBus.off(FriendRequestSentEvent.name, listener)
        }
    }
}
