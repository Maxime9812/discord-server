import { Message } from '../domain/message'

export type MessageRepository = {
    byId: (id: string) => Promise<Message>
    save(message: Message): Promise<void>
}

export const MessageRepository = Symbol('MessageRepository')
