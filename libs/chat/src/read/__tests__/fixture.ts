import { FriendRequest } from '../domain'
import { StubFriendRequestNotifier } from '../infra'
import {
    NotifyFriendRequestAcceptedHandler,
    NotifyFriendRequestAcceptedPayload,
    NotifyFriendRequestReceivedHandler,
    NotifyFriendRequestReceivedPayload,
} from '../use-cases'

export const createFixture = () => {
    const friendRequestNotifier = new StubFriendRequestNotifier()
    const notifyFriendRequestReceived = new NotifyFriendRequestReceivedHandler()
    const notifyFriendRequestAccepted = new NotifyFriendRequestAcceptedHandler()

    return {
        async whenNotifyFriendRequestAccepted(
            payload: Omit<NotifyFriendRequestAcceptedPayload, 'notifier'>
        ) {
            await notifyFriendRequestAccepted.execute({
                ...payload,
                notifier: friendRequestNotifier,
            })
        },
        async whenNotifyFriendRequestReceived(
            payload: Omit<NotifyFriendRequestReceivedPayload, 'notifier'>
        ) {
            await notifyFriendRequestReceived.execute({
                ...payload,
                notifier: friendRequestNotifier,
            })
        },
        thenLastFriendRequestAcceptedShouldBe: (userId: string) => {
            expect(friendRequestNotifier.lastFriendRequestAccepted).toEqual(
                userId
            )
        },
        thenLastFriendRequestReceivedShouldBe: (
            friendRequest: FriendRequest
        ) => {
            expect(friendRequestNotifier.lastFriendRequestReceived).toEqual(
                friendRequest
            )
        },
    }
}

export type Fixture = ReturnType<typeof createFixture>
