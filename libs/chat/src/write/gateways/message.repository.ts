import { Message } from '../domain'

export type MessageRepository = {
    byId: (id: string) => Promise<Message | undefined>
    save(message: Message): Promise<void>
}

export const MessageRepository = Symbol('MessageRepository')
