import { FriendRequest, FriendRequestSnapshot } from '@app/chat/write/domain'
import { FriendRequestRepository } from '@app/chat/write/gateways'

export class InMemoryFriendRequestRepository
    implements FriendRequestRepository
{
    private requests: Map<string, FriendRequestSnapshot> = new Map()

    async save(request: FriendRequest) {
        this.requests.set(request.id, request.snapshot)
    }

    getAll() {
        return [...this.requests.values()]
    }
}
