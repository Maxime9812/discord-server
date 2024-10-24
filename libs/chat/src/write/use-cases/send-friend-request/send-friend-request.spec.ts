import { userSocialBuilder } from '../../__tests__/user-social.builder'
import {
    createUserSocialFixture,
    UserSocialFixture,
} from '../../__tests__/user-social.fixture'
import { FriendRequest } from '../../domain'

const MAXIME = userSocialBuilder().withId('1').build()
const WILLIAM = userSocialBuilder().withId('2').build()

describe('Feature: Send friend request', () => {
    let fixture: UserSocialFixture

    beforeEach(() => {
        fixture = createUserSocialFixture()
    })

    test('Can send a friend request', async () => {
        fixture.givenNowIs(new Date('2024-10-23'))
        fixture.givenUserSocials([MAXIME, WILLIAM])

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: MAXIME.id,
            receiverId: WILLIAM.id,
        })

        fixture.thenUserSocialsShouldBe([
            userSocialBuilder(MAXIME.snapshot)
                .withFriendRequest(
                    FriendRequest.fromSnapshot({
                        id: '1234',
                        senderId: MAXIME.id,
                        receiverId: WILLIAM.id,
                        requestedAt: new Date('2024-10-23'),
                    })
                )
                .build(),
            WILLIAM,
        ])
    })
})
