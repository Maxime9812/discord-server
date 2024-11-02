export type GetFriendRequestsQuery = {
    execute: (userId: string) => Promise<FriendRequest[]>
}
