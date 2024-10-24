import {
    createUserSocialFixture,
    userSocialBuilder,
    UserSocialFixture,
} from '../../__tests__'
import {
    FriendRequest,
    UserSocialAlreadyFriendsError,
    UserSocialAlreadyRequestedError,
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
                    FriendRequest.fromSnapshot({
                        id: '1234',
                        senderId: MAXIME.id,
                        receiverId: WILLIAM.id,
                        requestedAt: NOW,
                    })
                )
                .build(),
            WILLIAM,
        ])
    })

    test('can NOT send a friend request to a friend', async () => {
        fixture.givenUserSocials([
            userSocialBuilder(MAXIME.snapshot).withFriend(WILLIAM.id).build(),
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

        await fixture.whenSendFriendRequest({
            requestId: '1234',
            senderId: MAXIME.id,
            receiverId: WILLIAM.id,
        })

        fixture.thenErrorShouldBe(
            new UserSocialAlreadyRequestedError(WILLIAM.id)
        )
    })
})
