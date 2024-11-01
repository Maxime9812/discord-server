import { Module, Scope } from '@nestjs/common'
import { AuthProvider, UserRepository } from './gateways'
import {
    BcryptPasswordHasher,
    CryptoIdProvider,
    DateProvider,
    IdProvider,
    PasswordHasher,
    RealDateProvider,
} from './domain'
import { DatabaseModule, SqlConnection } from '@app/shared'
import { Knex } from 'knex'
import { KnexUserRepository } from './infra'
import { redisConfig } from './infra/redis-config'
import RedisStore from 'connect-redis'
import { RequestSessionAuthGateway } from './infra/auth-provider/request-session-auth-provider'
import { Store } from 'express-session'
import { REQUEST } from '@nestjs/core'
import Redis from 'ioredis'

export const SessionsStore = Symbol('SessionsStore')

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: SessionsStore,
            useFactory: () => {
                const redisClient = new Redis(
                    process.env.NODE_ENV == 'production'
                        ? redisConfig.production
                        : redisConfig.development
                )
                return new (RedisStore as any)({ client: redisClient })
            },
        },
        {
            provide: UserRepository,
            inject: [SqlConnection],
            useFactory(knex: Knex) {
                return new KnexUserRepository(knex)
            },
        },
        {
            provide: IdProvider,
            useClass: CryptoIdProvider,
        },
        {
            provide: DateProvider,
            useClass: RealDateProvider,
        },
        {
            provide: PasswordHasher,
            useClass: BcryptPasswordHasher,
        },
        {
            provide: AuthProvider,
            inject: [REQUEST, SessionsStore],
            useFactory(request: Request, store: Store) {
                return new RequestSessionAuthGateway(request, store)
            },
            scope: Scope.REQUEST,
        },
    ],
    exports: [
        UserRepository,
        IdProvider,
        DateProvider,
        PasswordHasher,
        AuthProvider,
        SessionsStore,
    ],
})
export class IAMDependenciesModule {}
