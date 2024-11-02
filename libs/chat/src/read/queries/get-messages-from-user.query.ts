import { Message } from '../domain'

export type GetMessagesFromUserQuery = {
    execute: (userId: string, userId2: string) => Promise<Message[]>
}

export const GetMessagesFromUserQuery = Symbol('GetMessagesFromUserQuery')
