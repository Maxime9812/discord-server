import { ChatFixture, createChatFixture } from '../../__tests__/chat.fixture'
import { chatterBuilder } from '../../__tests__/chatter.builder'
import { FriendRequest } from '../../domain'

const MAXIME = chatterBuilder().withId('1').build()
const WILLIAM = chatterBuilder().withId('2').build()

describe('Feature: Send friend request', () => {
    let fixture: ChatFixture

    beforeEach(() => {
        fixture = createChatFixture()
    })

    test('Can send a friend request', async () => {
        fixture.givenNowIs(new Date('2024-10-23'))
        fixture.givenChatters([MAXIME, WILLIAM])

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: MAXIME.id,
            receiverId: WILLIAM.id,
        })

        fixture.thenFriendRequestsShouldBe([
            FriendRequest.fromSnapshot({
                id: '1234',
                status: 'pending',
                senderId: MAXIME.id,
                receiverId: WILLIAM.id,
                requestedAt: new Date('2024-10-23'),
            }),
        ])
    })
})
