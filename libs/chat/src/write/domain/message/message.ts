import { Chatter } from '../chatter'
import { MessageContent } from './message-content'
import {
    MessageAlreadyDeletedError,
    MessageWasNotSentByChatterError,
} from './message.errors'

type MessageProps = {
    id: string
    receiverId: string
    emitterId: string
    content: MessageContent
    sendAt: Date
    deleted: boolean
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
            deleted: this.props.deleted,
        }
    }

    delete(chatter: Chatter) {
        if (this.props.deleted) {
            throw new MessageAlreadyDeletedError()
        }
        if (chatter.id != this.props.emitterId) {
            throw new MessageWasNotSentByChatterError()
        }
        this.props.deleted = true
    }

    static fromSnapshot(snapshot: MessageSnapshot) {
        return new Message({
            id: snapshot.id,
            receiverId: snapshot.receiverId,
            emitterId: snapshot.emitterId,
            content: MessageContent.from(snapshot.content),
            sendAt: snapshot.sendAt,
            deleted: snapshot.deleted,
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
            deleted: false,
        })
    }
}
