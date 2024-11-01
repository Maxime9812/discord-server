import { User, UserSnapshot } from '../domain'

export const userBuilder = (
    snapshot: UserSnapshot = {
        id: '1',
        username: 'username',
        password: 'password',
        registeredAt: new Date('2024-10-23'),
    }
) => ({
    withId(id: string) {
        return userBuilder({
            ...snapshot,
            id,
        })
    },
    withUsername(username: string) {
        return userBuilder({
            ...snapshot,
            username,
        })
    },
    withPassword(password: string) {
        return userBuilder({
            ...snapshot,
            password,
        })
    },
    registeredAt(registeredAt: Date) {
        return userBuilder({
            ...snapshot,
            registeredAt,
        })
    },
    build() {
        return User.fromSnapshot(snapshot)
    },
})
