import { ChatFixture, createChatFixture } from '../../__tests__/chat.fixture'
import { Chatter } from '../../domain'

const MAXIME = Chatter.fromSnapshot({
    id: '1234',
})
const WILLIAM = Chatter.fromSnapshot({
    id: '5678',
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
            message: 'Hello, world!',
        })

        fixture.thenMessagesShouldBe([
            {
                id: 'message-id',
                emitterId: MAXIME.id,
                receiverId: WILLIAM.id,
                message: 'Hello, world!',
                sendAt: new Date('2024-10-23'),
            },
        ])
    })
})
