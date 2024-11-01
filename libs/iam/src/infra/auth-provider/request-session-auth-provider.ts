import { User } from '@app/iam/domain'
import { AuthProvider, AuthUser } from '@app/iam/gateways'
import { Session, Store } from 'express-session'

type AuthSession = Session & {
    user: AuthUser
}

export class RequestSessionAuthGateway implements AuthProvider {
    private readonly session: AuthSession

    constructor(
        request: Request,
        private readonly redisStore: Store
    ) {
        this.session = (request as any).session as AuthSession
    }

    async login(user: User): Promise<void> {
        this.session.user = { id: user.id }
    }

    async logout(): Promise<void> {
        return new Promise((resolve) => {
            this.redisStore.destroy(this.session.id, () => {
                this.session.cookie.expires = new Date()
                resolve()
            })
        })
    }
}
