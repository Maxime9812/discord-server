import {
    Chatter,
    DeterministicDateProvider,
    FriendRequest,
    Message,
} from '../domain'
import { InMemoryFriendRequestRepository } from '../infra'
import { InMemoryChatterRepository } from '../infra/gateways/in-memory-chatter.repository'
import { InMemoryMessageRepository } from '../infra/gateways/in-memory-message.repository'
import {
    SendDirectMessageHandler,
    SendDirectMessagePayload,
    SendFriendRequestHandler,
    SendFriendRequestPaylaod,
} from '../use-cases'
import { DeleteDirectMessagePayload } from '../use-cases/delete-direct-message/delete-direct-message.command'
import { DeleteDirectMessageHandler } from '../use-cases/delete-direct-message/delete-direct-message.handler'

export const createChatFixture = () => {
    const messageRepository = new InMemoryMessageRepository()
    const chatterRepository = new InMemoryChatterRepository()
    const friendRequestRepository = new InMemoryFriendRequestRepository()
    const dateProvider = new DeterministicDateProvider()
    const sendDirectMessageHandler = new SendDirectMessageHandler(
        messageRepository,
        chatterRepository,
        dateProvider
    )
    const deleteDirectMessageHandler = new DeleteDirectMessageHandler(
        messageRepository,
        chatterRepository
    )
    const sendFriendRequestHandler = new SendFriendRequestHandler(
        friendRequestRepository,
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
        givenMessages(messages: Message[]) {
            messageRepository.givenMessages(messages)
        },
        async whenSendDirectMessage(command: SendDirectMessagePayload) {
            try {
                await sendDirectMessageHandler.handle(command)
            } catch (e) {
                error = e
            }
        },
        async whenDeleteDirectMessage(command: DeleteDirectMessagePayload) {
            try {
                await deleteDirectMessageHandler.handle(command)
            } catch (e) {
                error = e
            }
        },
        async whenSendFriendRequest(command: SendFriendRequestPaylaod) {
            try {
                await sendFriendRequestHandler.handle(command)
            } catch (e) {
                error = e
            }
        },
        thenMessagesShouldBe(messages: Message[]) {
            expect(messageRepository.getAll()).toEqual(
                messages.map((m) => m.snapshot)
            )
        },
        thenErrorShouldBe(expectedError: Error) {
            expect(error).toEqual(expectedError)
        },
        thenFriendRequestsShouldBe(friendRequests: FriendRequest[]) {
            expect(friendRequestRepository.getAll()).toEqual(
                friendRequests.map((r) => r.snapshot)
            )
        },
    }
}

export type ChatFixture = ReturnType<typeof createChatFixture>
