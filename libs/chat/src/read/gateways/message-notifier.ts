import { Message } from '../domain'

export type MessageNotifier = {
    notify: (message: Message) => Promise<void>
}
