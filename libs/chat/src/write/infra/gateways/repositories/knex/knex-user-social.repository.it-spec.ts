import { knexConfig } from '@app/shared'
import knex, { Knex } from 'knex'
import { resetDB } from 'test/docker-manager'
import { KnexUserSocialRepository } from './knex-user-social.repository'
import {
    friendRequestBuilder,
    friendshipBuilder,
    userSocialBuilder,
} from '@app/chat/write/__tests__'
import { FriendshipPm, UserPm } from './persistence-models'
import { FriendRequestPm } from './persistence-models/friend-request.pm'

describe('KnexUserSocialRepository', () => {
    let sqlConnection: Knex
    let repository: KnexUserSocialRepository

    beforeAll(() => {
        sqlConnection = knex(knexConfig.test)
    })

    afterAll(async () => {
        await sqlConnection.destroy()
    })

    beforeEach(async () => {
        await resetDB(sqlConnection)
        repository = new KnexUserSocialRepository(sqlConnection)
    })

    describe('byId', () => {
        test('UserSocial is not found', async () => {
            const userSocial = await repository.byId(
                '349b8b68-109a-486f-bdc2-daedc31a6beb'
            )
            expect(userSocial).toBeUndefined()
        })

        test('UserSocial is found without friend or friend request', async () => {
            await insertUserSocial({
                id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                friends: [],
                friendRequests: [],
            })
            const userSocial = await repository.byId(
                '349b8b68-109a-486f-bdc2-daedc31a6beb'
            )
            const expectedUserSocial = userSocialBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .build()
            expect(userSocial?.snapshot).toEqual(expectedUserSocial.snapshot)
        })

        test('UserSocial is found with friends', async () => {
            await insertUserSocial({
                id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                friends: [
                    {
                        id: '720987c3-a3e1-4d17-9455-5237546c5357',
                        friend_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                        friend_2_id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
                        started_at: new Date('2024-10-23'),
                    },
                    {
                        id: 'c26633e8-b7fc-4280-abfb-2bc871f43ddb',
                        friend_id: 'a16bbdaa-ac5e-4455-a6ae-fea6abcf0441',
                        friend_2_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                        started_at: new Date('2024-10-24'),
                    },
                ],
                friendRequests: [],
            })
            const userSocial = await repository.byId(
                '349b8b68-109a-486f-bdc2-daedc31a6beb'
            )
            const expectedUserSocial = userSocialBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .withFriend(
                    friendshipBuilder()
                        .withId('720987c3-a3e1-4d17-9455-5237546c5357')
                        .withUserId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                        .withUserId2('b33adf7e-3ae7-4f17-9560-3388251c266f')
                        .withStartedAt(new Date('2024-10-23'))
                        .build()
                )
                .withFriend(
                    friendshipBuilder()
                        .withId('c26633e8-b7fc-4280-abfb-2bc871f43ddb')
                        .withUserId('a16bbdaa-ac5e-4455-a6ae-fea6abcf0441')
                        .withUserId2('349b8b68-109a-486f-bdc2-daedc31a6beb')
                        .withStartedAt(new Date('2024-10-24'))
                        .build()
                )
                .build()
            expect(userSocial?.snapshot).toEqual(expectedUserSocial.snapshot)
        })

        test('UserSocial is found with friend requests', async () => {
            await insertUserSocial({
                id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                friends: [],
                friendRequests: [
                    {
                        id: 'a16bbdaa-ac5e-4455-a6ae-fea6abcf0441',
                        sender_id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
                        receiver_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                        requested_at: new Date('2024-10-24'),
                    },
                    {
                        id: '0340d9a5-8bcb-4347-bd77-0262db5bef2d',
                        sender_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                        receiver_id: '79da9014-397f-4c89-ba9b-f597c7e232f9',
                        requested_at: new Date('2024-10-25'),
                    },
                ],
            })

            const userSocial = await repository.byId(
                '349b8b68-109a-486f-bdc2-daedc31a6beb'
            )

            const expectedUserSocial = userSocialBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .withFriendRequest(
                    friendRequestBuilder()
                        .withId('a16bbdaa-ac5e-4455-a6ae-fea6abcf0441')
                        .withSenderId('b33adf7e-3ae7-4f17-9560-3388251c266f')
                        .withReceiverId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                        .requestedAt(new Date('2024-10-24'))
                        .build()
                )
                .withFriendRequest(
                    friendRequestBuilder()
                        .withId('0340d9a5-8bcb-4347-bd77-0262db5bef2d')
                        .withSenderId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                        .withReceiverId('79da9014-397f-4c89-ba9b-f597c7e232f9')
                        .requestedAt(new Date('2024-10-25'))
                        .build()
                )
                .build()
            expect(userSocial?.snapshot).toEqual(expectedUserSocial.snapshot)
        })
    })

    describe('save', () => {
        test('save with friends', async () => {
            await insertUserSocial({
                id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                friends: [
                    {
                        id: '720987c3-a3e1-4d17-9455-5237546c5357',
                        friend_id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
                        friend_2_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                        started_at: new Date('2024-10-23'),
                    },
                ],
                friendRequests: [],
            })
            const userSocial = userSocialBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .withFriend(
                    friendshipBuilder()
                        .withId('720987c3-a3e1-4d17-9455-5237546c5357')
                        .withUserId('b33adf7e-3ae7-4f17-9560-3388251c266f')
                        .withUserId2('349b8b68-109a-486f-bdc2-daedc31a6beb')
                        .withStartedAt(new Date('2024-10-23'))
                        .build()
                )
                .build()

            await repository.save(userSocial)

            await thenFriendshipsShouldBe([
                {
                    id: '720987c3-a3e1-4d17-9455-5237546c5357',
                    friend_id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
                    friend_2_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                    started_at: new Date('2024-10-23'),
                },
            ])
        })

        test('save deleted friendships', async () => {
            await insertUserSocial({
                id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                friends: [
                    {
                        id: '720987c3-a3e1-4d17-9455-5237546c5357',
                        friend_id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
                        friend_2_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                        started_at: new Date('2024-10-23'),
                    },
                ],
                friendRequests: [],
            })

            const userSocial = userSocialBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .build()

            await repository.save(userSocial)

            await thenFriendshipsShouldBe([])
        })

        test('save with friend requests', async () => {
            await insertUserSocial({
                id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                friends: [],
                friendRequests: [
                    {
                        id: '720987c3-a3e1-4d17-9455-5237546c5357',
                        sender_id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
                        receiver_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                        requested_at: new Date('2024-10-23'),
                    },
                ],
            })
            const userSocial = userSocialBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .withFriendRequest(
                    friendRequestBuilder()
                        .withId('720987c3-a3e1-4d17-9455-5237546c5357')
                        .withSenderId('b33adf7e-3ae7-4f17-9560-3388251c266f')
                        .withReceiverId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                        .requestedAt(new Date('2024-10-23'))
                        .build()
                )
                .build()

            await repository.save(userSocial)

            await thenFriendRequestsShouldBe([
                {
                    id: '720987c3-a3e1-4d17-9455-5237546c5357',
                    sender_id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
                    receiver_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                    requested_at: new Date('2024-10-23'),
                },
            ])
        })

        test('Remove deleted friend requests', async () => {
            await insertUserSocial({
                id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                friends: [],
                friendRequests: [
                    {
                        id: '720987c3-a3e1-4d17-9455-5237546c5357',
                        sender_id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
                        receiver_id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
                        requested_at: new Date('2024-10-23'),
                    },
                ],
            })

            const userSocial = userSocialBuilder()
                .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
                .build()

            await repository.save(userSocial)

            await thenFriendRequestsShouldBe([])
        })
    })

    const thenFriendRequestsShouldBe = async (
        friendRequests: FriendRequestPm[]
    ) => {
        const friendRequestsFromDb =
            await sqlConnection<FriendRequestPm>('friend_requests').select()
        expect(friendRequestsFromDb).toEqual(friendRequests)
    }

    const thenFriendshipsShouldBe = async (friendships: FriendshipPm[]) => {
        const friendshipsFromDb =
            await sqlConnection<FriendshipPm>('friendships').select()
        expect(friendshipsFromDb).toEqual(friendships)
    }

    const insertUserSocial = async (userSocial: {
        id: string
        friends: FriendshipPm[]
        friendRequests: FriendRequestPm[]
    }) => {
        await sqlConnection<UserPm>('users').insert({
            id: userSocial.id,
        })
        if (userSocial.friends.length > 0) {
            await sqlConnection<FriendshipPm>('friendships').insert(
                userSocial.friends
            )
        }
        if (userSocial.friendRequests.length > 0) {
            await sqlConnection<FriendRequestPm>('friend_requests').insert(
                userSocial.friendRequests
            )
        }
    }
})
