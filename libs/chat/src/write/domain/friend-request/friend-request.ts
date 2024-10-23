type FriendRequestProps = {
    id: string
    status: 'pending'
    senderId: string
    receiverId: string
    requestedAt: Date
}

export type FriendRequestSnapshot = FriendRequest['snapshot']

type Request = {
    id: string
    senderId: string
    receiverId: string
    currentDate: Date
}

export class FriendRequest {
    private constructor(private props: FriendRequestProps) {}

    get id() {
        return this.props.id
    }

    get snapshot() {
        return {
            id: this.props.id,
            requestedAt: this.props.requestedAt,
            status: this.props.status,
            senderId: this.props.senderId,
            receiverId: this.props.receiverId,
        }
    }

    static fromSnapshot(snapshot: FriendRequestSnapshot) {
        return new FriendRequest(snapshot)
    }

    static request(request: Request): FriendRequest {
        return new FriendRequest({
            id: request.id,
            status: 'pending',
            senderId: request.senderId,
            receiverId: request.receiverId,
            requestedAt: request.currentDate,
        })
    }
}
