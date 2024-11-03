import { Subject } from 'rxjs'
import { MessageEvent } from '@nestjs/common'
import { MessageNotifier } from '../../gateways'
import { Message } from '../../domain'

export class SSEMessageNotifier implements MessageNotifier {
    constructor(private subject: Subject<MessageEvent>) {}

    async notify(message: Message): Promise<void> {
        this.subject.next({ type: 'message-received', data: message })
    }
}
