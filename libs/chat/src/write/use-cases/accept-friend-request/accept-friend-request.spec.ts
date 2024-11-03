import {
    createUserSocialFixture,
    friendRequestBuilder,
    friendshipBuilder,
    userSocialBuilder,
    UserSocialFixture,
} from '../../__tests__'
import {
    FriendRequestAcceptedEvent,
    UserSocialFriendRequestNotFound,
    UserSocialNotFoundError,
} from '../../domain'

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
                    friendshipBuilder()
                        .withUserId(WILLIAM.id)
                        .withStartedAt(NOW)
                        .build()
                )
                .withoutFriendRequest()
                .build(),
        ])
    })

    test('Can NOT accept a friend request that does not exist', async () => {
        fixture.givenUserSocials([MAXIME])

        await fixture.whenAcceptFriendRequest({
            requestId: '1',
            userId: MAXIME.id,
        })

        fixture.thenErrorShouldBe(new UserSocialFriendRequestNotFound('1'))
    })

    test('can NOT accept a friend request of a unknown user', async () => {
        await fixture.whenAcceptFriendRequest({
            requestId: '1',
            userId: 'unknown-user-id',
        })

        fixture.thenErrorShouldBe(
            new UserSocialNotFoundError('unknown-user-id')
        )
    })

    test('Emit friend request accepted event', async () => {
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

        fixture.thenEventShouldBeEmitted(
            new FriendRequestAcceptedEvent({
                senderId: WILLIAM.id,
                receiverId: MAXIME.id,
            })
        )
    })
})
