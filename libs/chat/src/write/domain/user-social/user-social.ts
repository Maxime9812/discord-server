import { Aggregate } from '@app/shared'
import {
    FriendRequest,
    FriendRequestAcceptedEvent,
    FriendRequestSentEvent,
} from '../friend-request'
import { Friendship } from './friendship'
import {
    UserSocialAlreadyFriendsError,
    UserSocialAlreadyRequestedError,
    UserSocialFriendRequestNotFound,
} from './user-social.errors'

type UserSocialProps = {
    id: string
    friends: Friendship[]
    friendRequests: FriendRequest[]
}

export type UserSocialSnapshot = UserSocial['snapshot']

export class UserSocial extends Aggregate<UserSocialProps> {
    get id() {
        return this.props.id
    }

    get snapshot() {
        return {
            id: this.props.id,
            friends: this.props.friends.map(
                (friendship) => friendship.snapshot
            ),
            friendRequests: this.props.friendRequests.map(
                (request) => request.snapshot
            ),
        }
    }

    private isFriendWith(receiver: UserSocial) {
        return this.props.friends.some(
            (friend) => friend.getfriendId(this.id) == receiver.id
        )
    }

    private hasRequested(receiver: UserSocial) {
        return this.props.friendRequests.some((request) =>
            request.isFor(receiver.id)
        )
    }

    private hasReceivedARequestFrom(sender: UserSocial) {
        return this.props.friendRequests.some((request) =>
            request.isFrom(sender.id)
        )
    }

    private requestAlreadyExists(userSocial: UserSocial) {
        return (
            this.hasRequested(userSocial) ||
            this.hasReceivedARequestFrom(userSocial)
        )
    }

    private getFriendRequestById(id: string) {
        return this.props.friendRequests.find((request) => request.id === id)
    }

    private removeFriendRequest(request: FriendRequest) {
        this.props.friendRequests = this.props.friendRequests.filter(
            (r) => r.id !== request.id
        )
    }

    requestToBeFriendWith(
        receiver: UserSocial,
        { id, currentDate }: { id: string; currentDate: Date }
    ) {
        if (this.isFriendWith(receiver)) {
            throw new UserSocialAlreadyFriendsError(receiver.id)
        }

        if (this.requestAlreadyExists(receiver)) {
            throw new UserSocialAlreadyRequestedError()
        }

        const request = FriendRequest.request({
            id,
            senderId: this.id,
            receiverId: receiver.id,
            currentDate,
        })

        this.props.friendRequests.push(request)
        this.emitEvent(
            new FriendRequestSentEvent({
                id,
                senderId: this.id,
                receiverId: receiver.id,
                requestedAt: currentDate,
            })
        )
    }

    acceptFriendRequest(requestId: string, currentDate: Date) {
        const request = this.getFriendRequestById(requestId)

        if (!request) {
            throw new UserSocialFriendRequestNotFound(requestId)
        }

        this.removeFriendRequest(request)

        const friendship = request.accept(currentDate)
        this.props.friends.push(friendship)
        this.emitEvent(
            new FriendRequestAcceptedEvent({
                senderId: request.senderId,
                receiverId: this.id,
            })
        )
    }

    static fromSnapshot(snapshot: UserSocialSnapshot) {
        return new UserSocial({
            id: snapshot.id,
            friends: snapshot.friends.map((friend) =>
                Friendship.fromSnapshot(friend)
            ),
            friendRequests: snapshot.friendRequests.map((request) =>
                FriendRequest.fromSnapshot(request)
            ),
        })
    }
}
