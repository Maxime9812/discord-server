import { AuthProvider, AuthUser } from '@app/iam/gateways'
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../metadata'

export class AuthGuard implements CanActivate {
    constructor(
        private authProvider: AuthProvider,
        private readonly reflector: Reflector
    ) {}
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        )
        if (isPublic) {
            return true
        }

        const session: { user: AuthUser } = context
            .switchToHttp()
            .getRequest().session

        return !(!session || !session.user)
    }
}
