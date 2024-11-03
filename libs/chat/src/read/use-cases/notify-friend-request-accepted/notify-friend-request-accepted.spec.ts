import { FriendRequestAcceptedEvent } from '@app/chat/write/domain'
import { createFixture, Fixture } from '../../__tests__'

describe('Feature: Notify friend request accepted', () => {
    let fixture: Fixture

    beforeEach(() => {
        fixture = createFixture()
    })

    test('Sender is notified when friend request is accepted', async () => {
        await fixture.whenNotifyFriendRequestAccepted({
            event: new FriendRequestAcceptedEvent({
                senderId: 'sender-id',
                receiverId: 'receiver-id',
            }),
            userId: 'sender-id',
        })

        fixture.thenLastFriendRequestAcceptedShouldBe('receiver-id')
    })

    test('Sender is NOT notified when friend request was not send by him', async () => {
        await fixture.whenNotifyFriendRequestAccepted({
            event: new FriendRequestAcceptedEvent({
                senderId: 'another-sender-id',
                receiverId: 'receiver-id',
            }),
            userId: 'sender-id',
        })

        fixture.thenLastFriendRequestAcceptedShouldBe(undefined)
    })
})
