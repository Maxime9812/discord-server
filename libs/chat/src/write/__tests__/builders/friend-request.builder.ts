import { FriendRequest, FriendRequestSnapshot } from '../../domain'

export const friendRequestBuilder = (
    snapshot: FriendRequestSnapshot = {
        id: '1',
        senderId: '1',
        receiverId: '2',
        requestedAt: new Date('2024-10-24'),
    }
) => ({
    withId(id: string) {
        snapshot.id = id
        return this
    },
    withSenderId(senderId: string) {
        snapshot.senderId = senderId
        return this
    },
    withReceiverId(receiverId: string) {
        snapshot.receiverId = receiverId
        return this
    },
    requestedAt(requestedAt: Date) {
        snapshot.requestedAt = requestedAt
        return this
    },
    build() {
        return FriendRequest.fromSnapshot(snapshot)
    },
})
