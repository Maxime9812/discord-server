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

    return {
        givenNowIs(now: Date) {
            dateProvider.now = now
        },
        givenChatters(chatters: Chatter[]) {
            chatterRepository.givenChatters(chatters)
        },
        whenSendDirectMessage(command: SendDirectMessagePayload) {
            return sendDirectMessageHandler.handle(command)
        },
        thenMessagesShouldBe(messages: MessageSnapshot[]) {
            expect(messageRepository.getAll()).toEqual(messages)
        },
    }
}

export type ChatFixture = ReturnType<typeof createChatFixture>
