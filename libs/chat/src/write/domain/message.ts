type MessageProps = {
    id: string
    receiverId: string
    emitterId: string
    message: string
    sendAt: Date
}

type WriteMessage = {
    id: string
    receiverId: string
    emitterId: string
    message: string
    currentDate: Date
}

export type MessageSnapshot = Message['snapshot']

export class Message {
    private constructor(private props: MessageProps) {}

    get id() {
        return this.props.id
    }

    get snapshot() {
        return {
            id: this.props.id,
            receiverId: this.props.receiverId,
            emitterId: this.props.emitterId,
            message: this.props.message,
            sendAt: this.props.sendAt,
        }
    }

    static fromSnapshot(snapshot: MessageSnapshot) {
        return new Message(snapshot)
    }

    static create({
        id,
        receiverId,
        emitterId,
        message,
        currentDate,
    }: WriteMessage) {
        return new Message({
            id,
            receiverId,
            emitterId,
            message,
            sendAt: currentDate,
        })
    }
}
