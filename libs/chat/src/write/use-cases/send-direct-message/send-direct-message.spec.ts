import {
    ChatFixture,
    chatterBuilder,
    createChatFixture,
    messageBuilder,
} from '../../__tests__'
import {
    ChatterNotFoundError,
    ChatterNotFriendWithReceiverError,
    MessageContentTooLongError,
} from '../../domain'
import { MessageSentEvent } from '../../domain/message/message.events'

const MAXIME = chatterBuilder().withId('1234').withFriend('5678').build()
const WILLIAM = chatterBuilder().withId('5678').withFriend('1234').build()
const MATHIS = chatterBuilder().withId('9012').withoutFriend().build()

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
            messageBuilder()
                .withId('message-id')
                .withEmitterId(MAXIME.id)
                .withReceiverId(WILLIAM.id)
                .withContent('Hello, world!')
                .sendAt(new Date('2024-10-23'))
                .build(),
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

    test('Can NOT send a message to an unknown chatter', async () => {
        fixture.givenChatters([MAXIME])

        await fixture.whenSendDirectMessage({
            messageId: 'message-id',
            emitterId: MAXIME.id,
            receiverId: 'unknown-id',
            content: 'Hello, world!',
        })

        fixture.thenErrorShouldBe(new ChatterNotFoundError('unknown-id'))
    })

    test('Can NOT send a message when emitter is unknown', async () => {
        fixture.givenChatters([MAXIME])

        await fixture.whenSendDirectMessage({
            messageId: 'message-id',
            emitterId: 'unknown-id',
            receiverId: MAXIME.id,
            content: 'Hello, world!',
        })

        fixture.thenErrorShouldBe(new ChatterNotFoundError('unknown-id'))
    })

    test('Emits a message sent event', async () => {
        fixture.givenChatters([MAXIME, WILLIAM])
        fixture.givenNowIs(new Date('2024-10-23'))

        await fixture.whenSendDirectMessage({
            messageId: 'message-id',
            emitterId: MAXIME.id,
            receiverId: WILLIAM.id,
            content: 'Hello, world!',
        })

        fixture.thenShouldHaveEmitMessageSentEvent(
            new MessageSentEvent({
                id: 'message-id',
                emitterId: MAXIME.id,
                receiverId: WILLIAM.id,
                content: 'Hello, world!',
                sendAt: new Date('2024-10-23'),
            })
        )
    })
})
