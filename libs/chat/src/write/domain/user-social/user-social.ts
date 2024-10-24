import { FriendRequest } from '../friend-request'
import {
    UserSocialAlreadyFriendsError,
    UserSocialAlreadyRequestedError,
} from './user-social.errors'

type UserSocialProps = {
    id: string
    friends: string[]
    friendRequests: FriendRequest[]
}

export type UserSocialSnapshot = UserSocial['snapshot']

export class UserSocial {
    private constructor(private props: UserSocialProps) {}

    get id() {
        return this.props.id
    }

    get snapshot() {
        return {
            id: this.props.id,
            friends: this.props.friends,
            friendRequests: this.props.friendRequests.map(
                (request) => request.snapshot
            ),
        }
    }

    private isFriendWith(receiver: UserSocial) {
        return this.props.friends.includes(receiver.id)
    }

    private hasRequested(receiver: UserSocial) {
        return this.props.friendRequests.some((request) =>
            request.isFor(receiver.id)
        )
    }

    requestToBeFriendWith(
        receiver: UserSocial,
        { id, currentDate }: { id: string; currentDate: Date }
    ) {
        if (this.isFriendWith(receiver)) {
            throw new UserSocialAlreadyFriendsError(receiver.id)
        }
        if (this.hasRequested(receiver)) {
            throw new UserSocialAlreadyRequestedError(receiver.id)
        }

        const request = FriendRequest.request({
            id,
            senderId: this.id,
            receiverId: receiver.id,
            currentDate,
        })

        this.props.friendRequests.push(request)
    }

    static fromSnapshot(snapshot: UserSocialSnapshot) {
        return new UserSocial({
            id: snapshot.id,
            friends: snapshot.friends,
            friendRequests: snapshot.friendRequests.map((request) =>
                FriendRequest.fromSnapshot(request)
            ),
        })
    }
}
