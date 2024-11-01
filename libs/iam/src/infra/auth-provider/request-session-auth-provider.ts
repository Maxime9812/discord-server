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
        return new Promise((resolve, reject) => {
            this.session.user = { id: user.id }
            this.session.save(() => {
                resolve()
            })
        })
    }

    async logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.session.destroy(() => {
                resolve()
            })
        })
    }
}
