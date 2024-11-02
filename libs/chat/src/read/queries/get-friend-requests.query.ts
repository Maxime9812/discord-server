import { FriendRequest } from '../domain'

export type GetFriendRequestsQuery = {
    execute: (userId: string) => Promise<FriendRequest[]>
}

export const GetFriendRequestsQuery = Symbol('GetFriendRequestsQuery')
