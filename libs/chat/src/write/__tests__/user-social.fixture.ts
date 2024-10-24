import { DeterministicDateProvider, UserSocial } from '../domain'
import { InMemoryUserSocialRepository } from '../infra'
import {
    SendFriendRequestHandler,
    SendFriendRequestPaylaod,
} from '../use-cases'

export const createUserSocialFixture = () => {
    const userSocialRepository = new InMemoryUserSocialRepository()
    const dateProvider = new DeterministicDateProvider()
    const sendFriendRequestHandler = new SendFriendRequestHandler(
        userSocialRepository,
        dateProvider
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
        thenUserSocialsShouldBe(userSocials: UserSocial[]) {
            expect(userSocialRepository.getAll()).toEqual(
                userSocials.map((m) => m.snapshot)
            )
        },
    }
}

export type UserSocialFixture = ReturnType<typeof createUserSocialFixture>
