import { MessageContent } from './message-content'

type MessageProps = {
    id: string
    receiverId: string
    emitterId: string
    content: MessageContent
    sendAt: Date
}

type WriteMessage = {
    id: string
    receiverId: string
    emitterId: string
    content: string
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
            content: this.props.content.value,
            sendAt: this.props.sendAt,
        }
    }

    static fromSnapshot(snapshot: MessageSnapshot) {
        return new Message({
            id: snapshot.id,
            receiverId: snapshot.receiverId,
            emitterId: snapshot.emitterId,
            content: MessageContent.from(snapshot.content),
            sendAt: snapshot.sendAt,
        })
    }

    static create({
        id,
        receiverId,
        emitterId,
        content,
        currentDate,
    }: WriteMessage) {
        return new Message({
            id,
            receiverId,
            emitterId,
            content: MessageContent.from(content),
            sendAt: currentDate,
        })
    }
}
