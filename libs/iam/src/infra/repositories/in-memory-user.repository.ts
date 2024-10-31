import { User, UserSnapshot } from '@app/iam/domain'
import { UserRepository } from '@app/iam/gateways'

export class InMemoryUserRepository implements UserRepository {
    private users: Map<string, UserSnapshot> = new Map()

    async save(user: User) {
        this.users.set(user.id, user.snapshot)
    }

    async existsByUsername(username: string) {
        return Array.from(this.users.values()).some(
            (user) => user.username === username
        )
    }

    getAll() {
        return Array.from(this.users.values())
    }

    givenUsers(users: User[]) {
        users.forEach((user) => this.users.set(user.id, user.snapshot))
    }
}
