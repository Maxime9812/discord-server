import {
    createUserSocialFixture,
    friendRequestBuilder,
    friendshipBuilder,
    userSocialBuilder,
    UserSocialFixture,
} from '../../__tests__'
import {
    FriendRequestSentEvent,
    UserSocialAlreadyFriendsError,
    UserSocialAlreadyRequestedError,
    UserSocialNotFoundError,
} from '../../domain'

const MAXIME = userSocialBuilder().withId('1').build()
const WILLIAM = userSocialBuilder().withId('2').build()
const NOW = new Date('2024-10-23')

describe('Feature: Send friend request', () => {
    let fixture: UserSocialFixture

    beforeEach(() => {
        fixture = createUserSocialFixture()
        fixture.givenNowIs(NOW)
    })

    test('Can send a friend request', async () => {
        fixture.givenUserSocials([MAXIME, WILLIAM])

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: MAXIME.id,
            receiverId: WILLIAM.id,
        })

        fixture.thenUserSocialsShouldBe([
            userSocialBuilder(MAXIME.snapshot)
                .withFriendRequest(
                    friendRequestBuilder()
                        .withId('1234')
                        .withSenderId(MAXIME.id)
                        .withReceiverId(WILLIAM.id)
                        .requestedAt(NOW)
                        .build()
                )
                .build(),
            WILLIAM,
        ])
    })

    test('can NOT send a friend request to a friend', async () => {
        fixture.givenUserSocials([
            userSocialBuilder(MAXIME.snapshot)
                .withFriend(
                    friendshipBuilder()
                        .withId('1234')
                        .withUserId(WILLIAM.id)
                        .withUserId2(MAXIME.id)
                        .withStartedAt(NOW)
                        .build()
                )
                .build(),
            WILLIAM,
        ])

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: MAXIME.id,
            receiverId: WILLIAM.id,
        })

        fixture.thenErrorShouldBe(new UserSocialAlreadyFriendsError(WILLIAM.id))
    })

    test('can NOT send a friend request to a user already requested', async () => {
        fixture.givenUserSocials([
            userSocialBuilder(MAXIME.snapshot)
                .withFriendRequest(
                    friendRequestBuilder()
                        .withId('1234')
                        .withSenderId(MAXIME.id)
                        .withReceiverId(WILLIAM.id)
                        .build()
                )
                .build(),
            WILLIAM,
        ])

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: MAXIME.id,
            receiverId: WILLIAM.id,
        })

        fixture.thenErrorShouldBe(new UserSocialAlreadyRequestedError())
    })

    test('can NOT send a friend request to a user that already requested you', async () => {
        fixture.givenUserSocials([
            userSocialBuilder(MAXIME.snapshot)
                .withFriendRequest(
                    friendRequestBuilder()
                        .withId('1234')
                        .withSenderId(WILLIAM.id)
                        .withReceiverId(MAXIME.id)
                        .build()
                )
                .build(),
            WILLIAM,
        ])

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: MAXIME.id,
            receiverId: WILLIAM.id,
        })

        fixture.thenErrorShouldBe(new UserSocialAlreadyRequestedError())
    })

    test('Can NOT send a friend request to a unknown receiver', async () => {
        fixture.givenUserSocials([MAXIME])

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: MAXIME.id,
            receiverId: WILLIAM.id,
        })

        fixture.thenErrorShouldBe(new UserSocialNotFoundError(WILLIAM.id))
    })

    test('Can NOT send a friend request with a unknown sender', async () => {
        fixture.givenUserSocials([MAXIME])

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: WILLIAM.id,
            receiverId: MAXIME.id,
        })

        fixture.thenErrorShouldBe(new UserSocialNotFoundError(WILLIAM.id))
    })

    test('Emit event when friend request is sent', async () => {
        fixture.givenUserSocials([MAXIME, WILLIAM])

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: MAXIME.id,
            receiverId: WILLIAM.id,
        })

        fixture.thenEventShouldBeEmitted(
            new FriendRequestSentEvent({
                id: '1234',
                senderId: MAXIME.id,
                receiverId: WILLIAM.id,
                requestedAt: NOW,
            })
        )
    })
})
