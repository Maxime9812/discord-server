import { DomainEvent, StubEventBus } from '@app/shared'
import { DeterministicDateProvider, UserSocial } from '../../domain'
import { InMemoryUserSocialRepository } from '../../infra'
import {
    SendFriendRequestHandler,
    SendFriendRequestPaylaod,
} from '../../use-cases'
import {
    AcceptFriendRequestPayload,
    AcceptFriendRequestHandler,
} from '../../use-cases/accept-friend-request'

export const createUserSocialFixture = () => {
    const userSocialRepository = new InMemoryUserSocialRepository()
    const dateProvider = new DeterministicDateProvider()
    const eventBus = new StubEventBus()
    const sendFriendRequestHandler = new SendFriendRequestHandler(
        userSocialRepository,
        dateProvider,
        eventBus
    )
    const acceptedFriendRequestHandler = new AcceptFriendRequestHandler(
        userSocialRepository,
        dateProvider,
        eventBus
    )
    let error: Error

    return {
        givenNowIs(now: Date) {
            dateProvider.now = now
        },
        givenUserSocials(userSocials: UserSocial[]) {
            userSocialRepository.givenUserSocials(userSocials)
        },
        async whenSendFriendRequest(command: SendFriendRequestPaylaod) {
            try {
                await sendFriendRequestHandler.handle(command)
            } catch (e) {
                error = e
            }
        },
        async whenAcceptFriendRequest(command: AcceptFriendRequestPayload) {
            try {
                await acceptedFriendRequestHandler.handle(command)
            } catch (e) {
                error = e
            }
        },
        thenUserSocialsShouldBe(userSocials: UserSocial[]) {
            expect(userSocialRepository.getAll()).toEqual(
                userSocials.map((m) => m.snapshot)
            )
        },
        thenErrorShouldBe(expectedError: Error) {
            expect(error).toEqual(expectedError)
        },
        thenEventShouldBeEmitted(event: DomainEvent<any>) {
            expect(eventBus.emittedEvent).toEqual(event)
        },
    }
}

export type UserSocialFixture = ReturnType<typeof createUserSocialFixture>
