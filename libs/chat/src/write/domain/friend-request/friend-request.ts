import { Friendship } from '../user-social'

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

    get senderId() {
        return this.props.senderId
    }

    isFor(receiverId: string) {
        return this.props.receiverId === receiverId
    }

    isFrom(senderId: string) {
        return this.props.senderId === senderId
    }

    get snapshot() {
        return {
            id: this.props.id,
            requestedAt: this.props.requestedAt,
            senderId: this.props.senderId,
            receiverId: this.props.receiverId,
        }
    }

    accept(currentDate: Date) {
        return Friendship.start({
            id: this.props.id,
            userId: this.props.receiverId,
            userId2: this.props.senderId,
            currentDate,
        })
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
