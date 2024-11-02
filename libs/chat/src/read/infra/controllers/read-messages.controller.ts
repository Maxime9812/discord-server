import {
    Controller,
    Get,
    Param,
    Sse,
    Res,
    MessageEvent,
    Inject,
} from '@nestjs/common'
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger'
import { GetMessagesWithUserParam } from '../params'
import { AuthUser, User } from '@app/iam'
import { Subject } from 'rxjs'
import { Response } from 'express'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { NotifyMessageSent } from '../../use-cases'
import { SSEMessageNotifier } from '../message-notifiers/sse-message-notifier'
import { MessageSentEvent } from '@app/chat/write/domain/message/message.events'
import { GetChatsQuery, GetMessagesFromUserQuery } from '../../queries'

@Controller('messages')
@ApiTags('Chat')
@ApiCookieAuth()
export class ReadMessagesController {
    constructor(
        private eventBus: EventEmitter2,
        private notifyMessageSent: NotifyMessageSent,
        @Inject(GetMessagesFromUserQuery)
        private getMessagesFromUserQuery: GetMessagesFromUserQuery
    ) {}

    @Get(':userId')
    async getMessagesWithUser(
        @User() user: AuthUser,
        @Param() params: GetMessagesWithUserParam
    ) {
        return this.getMessagesFromUserQuery.execute(user.id, params.userId)
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
