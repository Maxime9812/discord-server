import { FriendRequest } from '../domain'

export type FriendRequestRepository = {
    save(request: FriendRequest): Promise<void>
}
