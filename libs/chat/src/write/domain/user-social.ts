import { FriendRequest } from './friend-request'

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

    requestToBeFriendWith(
        receiver: UserSocial,
        { id, currentDate }: { id: string; currentDate: Date }
    ) {
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
