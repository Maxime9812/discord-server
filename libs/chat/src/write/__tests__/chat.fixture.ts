import { Chatter, DeterministicDateProvider, MessageSnapshot } from '../domain'
import { InMemoryChatterRepository } from '../infra/gateways/in-memory-chatter.repository'
import { InMemoryMessageRepository } from '../infra/gateways/in-memory-message.repository'
import {
    SendDirectMessageHandler,
    SendDirectMessagePayload,
} from '../use-cases'

export const createChatFixture = () => {
    const messageRepository = new InMemoryMessageRepository()
    const chatterRepository = new InMemoryChatterRepository()
    const dateProvider = new DeterministicDateProvider()
    const sendDirectMessageHandler = new SendDirectMessageHandler(
        messageRepository,
        chatterRepository,
        dateProvider
    )
    let error: Error

    return {
        givenNowIs(now: Date) {
            dateProvider.now = now
        },
        givenChatters(chatters: Chatter[]) {
            chatterRepository.givenChatters(chatters)
        },
        async whenSendDirectMessage(command: SendDirectMessagePayload) {
            try {
                await sendDirectMessageHandler.handle(command)
            } catch (e) {
                error = e
            }
        },
        thenMessagesShouldBe(messages: MessageSnapshot[]) {
            expect(messageRepository.getAll()).toEqual(messages)
        },
        thenErrorShouldBe(expectedError: Error) {
            expect(error).toEqual(expectedError)
        },
    }
}

export type ChatFixture = ReturnType<typeof createChatFixture>
