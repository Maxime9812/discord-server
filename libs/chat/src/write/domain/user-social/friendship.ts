type FriendshipProps = {
    id: string
    userId: string
    userId2: string
    startedAt: Date
}

export type FriendshipSnapshot = Friendship['snapshot']

export class Friendship {
    private constructor(private props: FriendshipProps) {}

    get id() {
        return this.props.id
    }

    getfriendId(userId: string) {
        if (userId === this.props.userId) {
            return this.props.userId2
        }

        return this.props.userId
    }

    get snapshot() {
        return {
            id: this.id,
            userId: this.props.userId,
            userId2: this.props.userId2,
            startedAt: this.props.startedAt,
        }
    }

    static start({
        userId,
        userId2,
        currentDate,
        id,
    }: {
        id: string
        userId: string
        userId2: string
        currentDate: Date
    }) {
        return new Friendship({
            id,
            userId,
            userId2,
            startedAt: currentDate,
        })
    }

    static fromSnapshot(snapshot: FriendshipProps) {
        return new Friendship(snapshot)
    }
}
