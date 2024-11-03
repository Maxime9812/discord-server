import { Aggregate } from '@app/shared'
import { FriendRequest } from '../friend-request'
import { Message } from '../message'
import { ChatterNotFriendWithReceiverError } from './chatter.errors'
import { MessageSentEvent } from '../message/message.events'

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

export class Chatter extends Aggregate<ChatterProps> {
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

        const message = Message.create({
            id,
            receiverId: receiver.id,
            emitterId: this.id,
            content,
            currentDate,
        })

        this.emitEvent(
            new MessageSentEvent({
                id: message.id,
                emitterId: this.id,
                receiverId: receiver.id,
                content,
                sendAt: currentDate,
            })
        )

        return message
    }

    requestToBeFriendWith(
        receiver: Chatter,
        { id, currentDate }: { id: string; currentDate: Date }
    ) {
        return FriendRequest.request({
            id,
            senderId: this.id,
            receiverId: receiver.id,
            currentDate,
        })
    }

    static fromSnapshot(snapshot: ChatterSnapshot) {
        return new Chatter(snapshot)
    }
}
