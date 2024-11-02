import { Chat } from '../domain'

export type GetChatsQuery = {
    execute: (userId: string) => Promise<Chat[]>
}

export const GetChatsQuery = Symbol('GetChatsQuery')
