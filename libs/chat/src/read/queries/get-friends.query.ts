import { Friend } from '../domain/friend'

export type GetFriendsQuery = {
    execute: (userId: string) => Promise<Friend[]>
}

export const GetFriendsQuery = Symbol('GetFriendsQuery')
