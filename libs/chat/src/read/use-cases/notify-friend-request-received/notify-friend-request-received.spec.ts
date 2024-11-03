import { FriendRequestSentEvent } from '@app/chat/write/domain'
import { StubFriendRequestNotifier } from '../../infra'
import { NotifyFriendRequestReceivedHandler } from './notify-friend-request-received.handler'

describe('Feature: Notify Friend Request Received', () => {
    test('User is notified when friend request is received', async () => {
        const notifier = new StubFriendRequestNotifier()
        const usecase = new NotifyFriendRequestReceivedHandler()

        await usecase.execute({
            event: new FriendRequestSentEvent({
                id: 'request-id',
                receiverId: 'receiver-id',
                senderId: 'sender-id',
                requestedAt: new Date('2021-01-01'),
            }),
            userId: 'receiver-id',
            notifier,
        })

        expect(notifier.lastNotification).toEqual({
            id: 'request-id',
            senderId: 'sender-id',
            requestedAt: new Date('2021-01-01'),
        })
    })

    test('User is not notified when friend request is received by another user', async () => {
        const notifier = new StubFriendRequestNotifier()
        const usecase = new NotifyFriendRequestReceivedHandler()

        await usecase.execute({
            event: new FriendRequestSentEvent({
                id: 'request-id',
                receiverId: 'another-receiver-id',
                senderId: 'sender-id',
                requestedAt: new Date('2021-01-01'),
            }),
            userId: 'receiver-id',
            notifier,
        })

        expect(notifier.lastNotification).toBeUndefined()
    })
})

