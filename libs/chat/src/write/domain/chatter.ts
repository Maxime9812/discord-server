import { Message } from './message'

type ChatterProps = {
    id: string
}

type WriteMessage = {
    id: string
    message: string
    currentDate: Date
}

export type ChatterSnapshot = Chatter['snapshot']

export class Chatter {
    private constructor(private props: ChatterProps) {}

    get id() {
        return this.props.id
    }

    get snapshot() {
        return {
            id: this.props.id,
        }
    }

    write(receiver: Chatter, { id, message, currentDate }: WriteMessage) {
        return Message.create({
            id,
            receiverId: receiver.id,
            emitterId: this.id,
            message,
            currentDate,
        })
    }

    static fromSnapshot(snapshot: ChatterSnapshot) {
        return new Chatter(snapshot)
    }
}
