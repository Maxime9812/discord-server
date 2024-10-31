import { Module } from '@nestjs/common'
import { UserRepository } from './gateways'
import {
    DateProvider,
    DeterministicDateProvider,
    DeterministicIdProvider,
    DeterministicPasswordEncryption,
    IdProvider,
    PasswordEncryption,
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
            useClass: DeterministicIdProvider,
        },
        {
            provide: DateProvider,
            useClass: DeterministicDateProvider,
        },
        {
            provide: PasswordEncryption,
            useClass: DeterministicPasswordEncryption,
        },
    ],
    exports: [UserRepository, IdProvider, DateProvider, PasswordEncryption],
})
export class IAMDependenciesModule {}
