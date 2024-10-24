type FriendRequestProps = {
    id: string
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
            senderId: request.senderId,
            receiverId: request.receiverId,
            requestedAt: request.currentDate,
        })
    }
}
