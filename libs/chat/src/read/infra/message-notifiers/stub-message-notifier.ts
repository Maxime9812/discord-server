import { Message } from '../../domain'
import { MessageNotifier } from '../../gateways'

export class StubMessageNotifier implements MessageNotifier {
    lastMessage: Message

    async notify(message: Message): Promise<void> {
        this.lastMessage = message
    }
}
