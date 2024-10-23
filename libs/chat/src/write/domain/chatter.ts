import { DomainError } from '@app/shared'
import { Message } from './message'

type ChatterProps = {
    id: string
    friends: string[]
}

type WriteMessage = {
    id: string
    content: string
    currentDate: Date
}

export type ChatterSnapshot = Chatter['snapshot']

export class ChatterNotFriendWithReceiverError extends DomainError {
    constructor() {
        super('Chatters are not friends')
    }
}

export class Chatter {
    private constructor(private props: ChatterProps) {}

    get id() {
        return this.props.id
    }

    get snapshot() {
        return {
            id: this.props.id,
            friends: this.props.friends,
        }
    }

    private isFriendWith(chatter: Chatter) {
        return this.props.friends.includes(chatter.id)
    }

    write(receiver: Chatter, { id, content, currentDate }: WriteMessage) {
        if (!this.isFriendWith(receiver)) {
            throw new ChatterNotFriendWithReceiverError()
        }

        return Message.create({
            id,
            receiverId: receiver.id,
            emitterId: this.id,
            content,
            currentDate,
        })
    }

    static fromSnapshot(snapshot: ChatterSnapshot) {
        return new Chatter(snapshot)
    }
}
