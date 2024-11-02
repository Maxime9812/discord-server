import { Controller, Get, Param, Sse, Res, MessageEvent } from '@nestjs/common'
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger'
import { GetMessagesWithUserParam } from '../params'
import { AuthUser, User } from '@app/iam'
import { Subject } from 'rxjs'
import { Response } from 'express'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { NotifyMessageSent } from '../../use-cases'
import { SSEMessageNotifier } from '../message-notifiers/sse-message-notifier'
import { MessageSentEvent } from '@app/chat/write/domain/message/message.events'

@Controller('messages')
@ApiTags('Chat')
@ApiCookieAuth()
export class ReadChatController {
    constructor(
        private eventBus: EventEmitter2,
        private notifyMessageSent: NotifyMessageSent
    ) {}

    @Get('/:userId')
    async getMessagesWithUser(
        @Param() params: GetMessagesWithUserParam,
        @User() user: AuthUser
    ) {
        return []
    }

    @Sse('')
    async notifyMessages(@User() user: AuthUser, @Res() res: Response) {
        const subject = new Subject<MessageEvent>()
        const notifier = new SSEMessageNotifier(subject)

        const listener = async (event: MessageSentEvent) => {
            await this.notifyMessageSent.execute({
                event,
                userId: user.id,
                notifier,
            })
        }

        this.eventBus.on(MessageSentEvent.name, listener)

        res.once('close', () => {
            this.eventBus.off(MessageSentEvent.name, listener)
        })

        return subject
    }
}
