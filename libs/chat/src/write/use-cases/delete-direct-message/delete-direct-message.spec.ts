import {
    ChatFixture,
    chatterBuilder,
    createChatFixture,
    messageBuilder,
} from '../../__tests__'
import {
    ChatterNotFoundError,
    MessageAlreadyDeletedError,
    MessageNotFoundError,
    MessageWasNotSentByChatterError,
} from '../../domain'

const EMITTER = chatterBuilder().withId('1234').build()
const RECEIVER = chatterBuilder().withId('5678').build()

const messageSendBuilder = messageBuilder()
    .withId('1')
    .withEmitterId(EMITTER.id)

describe('Feature: Delete Direct Message', () => {
    let fixture: ChatFixture

    beforeEach(() => {
        fixture = createChatFixture()
    })

    test('Can delete a message', async () => {
        const messageSend = messageSendBuilder.build()
        fixture.givenChatters([EMITTER, RECEIVER])
        fixture.givenMessages([messageSend])

        await fixture.whenDeleteDirectMessage({
            id: messageSend.id,
            chatterId: EMITTER.id,
        })

        fixture.thenMessagesShouldBe([messageSendBuilder.deleted().build()])
    })

    test('Can NOT delete a message when message was not send by the chatter', async () => {
        const message = messageSendBuilder.build()
        fixture.givenChatters([EMITTER, RECEIVER])
        fixture.givenMessages([message])

        await fixture.whenDeleteDirectMessage({
            id: message.id,
            chatterId: RECEIVER.id,
        })

        fixture.thenErrorShouldBe(new MessageWasNotSentByChatterError())
    })

    test('Can NOT delete a message already deleted', async () => {
        const message = messageSendBuilder.deleted().build()
        fixture.givenChatters([EMITTER, RECEIVER])
        fixture.givenMessages([message])

        await fixture.whenDeleteDirectMessage({
            id: message.id,
            chatterId: EMITTER.id,
        })

        fixture.thenErrorShouldBe(new MessageAlreadyDeletedError())
    })

    test('Can NOT delete a message that does not exist', async () => {
        fixture.givenChatters([EMITTER, RECEIVER])

        await fixture.whenDeleteDirectMessage({
            id: '1',
            chatterId: EMITTER.id,
        })

        fixture.thenErrorShouldBe(new MessageNotFoundError('1'))
    })

    test('Can NOT delete a message when chatter does not exist', async () => {
        const message = messageSendBuilder.build()
        fixture.givenMessages([message])

        await fixture.whenDeleteDirectMessage({
            id: message.id,
            chatterId: '1',
        })

        fixture.thenErrorShouldBe(new ChatterNotFoundError('1'))
    })
})
