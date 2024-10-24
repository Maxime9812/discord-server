import {
    createUserSocialFixture,
    friendRequestBuilder,
    userSocialBuilder,
    UserSocialFixture,
} from '../../__tests__'
import { Friendship } from '../../domain'

const MAXIME = userSocialBuilder().withId('1').build()
const WILLIAM = userSocialBuilder().withId('2').build()
const NOW = new Date('2024-10-23')

describe('Feature: Accept friend request', () => {
    let fixture: UserSocialFixture

    beforeEach(() => {
        fixture = createUserSocialFixture()
        fixture.givenNowIs(NOW)
    })

    test('Can accept a friend request', async () => {
        const friendRequest = friendRequestBuilder()
            .withId('1')
            .withSenderId(WILLIAM.id)
            .build()

        const user = userSocialBuilder(MAXIME.snapshot)
            .withFriendRequest(friendRequest)
            .build()
        fixture.givenUserSocials([user])

        await fixture.whenAcceptFriendRequest({
            requestId: friendRequest.id,
            userId: MAXIME.id,
        })

        fixture.thenUserSocialsShouldBe([
            userSocialBuilder(user.snapshot)
                .withFriend(
                    Friendship.fromSnapshot({
                        friendId: WILLIAM.id,
                        startedAt: NOW,
                    })
                )
                .withoutFriendRequest()
                .build(),
        ])
    })
})
