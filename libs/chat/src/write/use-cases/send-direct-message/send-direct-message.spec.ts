import { ChatFixture, createChatFixture } from '../../__tests__/chat.fixture'
import {
    Chatter,
    ChatterNotFriendWithReceiverError,
    MessageContentTooLongError,
} from '../../domain'

const MAXIME = Chatter.fromSnapshot({
    id: '1234',
    friends: ['5678'],
})
const WILLIAM = Chatter.fromSnapshot({
    id: '5678',
    friends: ['1234'],
})
const MATHIS = Chatter.fromSnapshot({
    id: '9012',
    friends: [],
})

describe('Feature: Send direct message', () => {
    let fixture: ChatFixture

    beforeEach(() => {
        fixture = createChatFixture()
    })

    test('Can send a simple direct message', async () => {
        fixture.givenChatters([MAXIME, WILLIAM])
        fixture.givenNowIs(new Date('2024-10-23'))

        await fixture.whenSendDirectMessage({
            messageId: 'message-id',
            emitterId: MAXIME.id,
            receiverId: WILLIAM.id,
            content: 'Hello, world!',
        })

        fixture.thenMessagesShouldBe([
            {
                id: 'message-id',
                emitterId: MAXIME.id,
                receiverId: WILLIAM.id,
                content: 'Hello, world!',
                sendAt: new Date('2024-10-23'),
            },
        ])
    })

    test('Can NOT send a message when chatters are not friends', async () => {
        fixture.givenChatters([MATHIS, WILLIAM])

        await fixture.whenSendDirectMessage({
            messageId: 'message-id',
            emitterId: WILLIAM.id,
            receiverId: MATHIS.id,
            content: 'Hello, world!',
        })

        fixture.thenErrorShouldBe(new ChatterNotFriendWithReceiverError())
    })

    test('Can NOT send a message with a content longer than 500 characters', async () => {
        fixture.givenChatters([MAXIME, WILLIAM])

        await fixture.whenSendDirectMessage({
            messageId: 'message-id',
            emitterId: MAXIME.id,
            receiverId: WILLIAM.id,
            content: 'a'.repeat(501),
        })

        fixture.thenErrorShouldBe(new MessageContentTooLongError())
    })
})
