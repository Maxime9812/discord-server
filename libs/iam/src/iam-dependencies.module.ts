import { Module } from '@nestjs/common'
import { UserRepository } from './gateways'
import {
    BcryptPasswordHasher,
    CryptoIdProvider,
    DateProvider,
    IdProvider,
    PasswordHasher,
    RealDateProvider,
} from './domain'
import { DatabaseModule, SqlConnection } from '@app/shared'
import { KnexUserRepository } from './infra/repositories/knex-user.repository'
import { Knex } from 'knex'

@Module({
    imports: [DatabaseModule],
    providers: [
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
    ],
    exports: [UserRepository, IdProvider, DateProvider, PasswordHasher],
})
export class IAMDependenciesModule {}
