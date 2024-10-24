type FriendshipProps = {
    friendId: string
    startedAt: Date
}

export type FriendshipSnapshot = Friendship['snapshot']

export class Friendship {
    private constructor(private props: FriendshipProps) {}

    get friendId() {
        return this.props.friendId
    }

    get snapshot() {
        return {
            friendId: this.props.friendId,
            startedAt: this.props.startedAt,
        }
    }

    static start({
        friendId,
        currentDate,
    }: {
        friendId: string
        currentDate: Date
    }) {
        return new Friendship({
            friendId,
            startedAt: currentDate,
        })
    }

    static fromSnapshot(snapshot: FriendshipProps) {
        return new Friendship(snapshot)
    }
}
