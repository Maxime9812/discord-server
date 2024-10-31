import { User } from '@app/iam/domain'
import { AuthProvider } from '@app/iam/gateways'

export class FakeAuthProvider implements AuthProvider {
    loggedInUser: User
    async login(user: User) {
        this.loggedInUser = user
    }
}
