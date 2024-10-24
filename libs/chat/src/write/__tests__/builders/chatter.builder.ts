import { Chatter, ChatterSnapshot } from '../../domain'

export const chatterBuilder = (
    snapshot: ChatterSnapshot = {
        id: '1',
        friends: [],
    }
) => ({
    withId(id: string) {
        return chatterBuilder({ ...snapshot, id })
    },
    withFriend(friend: string) {
        return chatterBuilder({
            ...snapshot,
            friends: [...snapshot.friends, friend],
        })
    },
    withoutFriend() {
        return chatterBuilder({
            ...snapshot,
            friends: [],
        })
    },
    build() {
        return Chatter.fromSnapshot(snapshot)
    },
})
