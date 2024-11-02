import { Module } from '@nestjs/common'
import { IAMDependenciesModule } from './iam-dependencies.module'
import { LoginHandler, LogoutHandler, RegisterHandler } from './use-cases'
import { CommandBus, DatabaseModule, SqlConnection } from '@app/shared'
import { AuthProvider, UserRepository } from './gateways'
import { DateProvider, IdProvider, PasswordHasher } from './domain'
import { Knex } from 'knex'
import { knexGetMeQuery } from './infra'
import { GetMeQuery } from './queries'

@Module({
    imports: [IAMDependenciesModule, DatabaseModule],
    providers: [
        {
            provide: RegisterHandler,
            inject: [
                UserRepository,
                PasswordHasher,
                IdProvider,
                DateProvider,
                AuthProvider,
            ],
            useFactory: (
                userRepository: UserRepository,
                passwordEncryption: PasswordHasher,
                idProvider: IdProvider,
                dateProvider: DateProvider,
                authProvider: AuthProvider
            ) => {
                return new RegisterHandler(
                    userRepository,
                    passwordEncryption,
                    idProvider,
                    dateProvider,
                    authProvider
                )
            },
        },
        {
            provide: LoginHandler,
            inject: [UserRepository, AuthProvider, PasswordHasher, CommandBus],
            useFactory: (
                userRepository: UserRepository,
                authProvider: AuthProvider,
                passwordHasher: PasswordHasher
            ) => {
                return new LoginHandler(
                    userRepository,
                    authProvider,
                    passwordHasher
                )
            },
        },
        {
            provide: LogoutHandler,
            inject: [AuthProvider],
            useFactory: (authProvider: AuthProvider) => {
                return new LogoutHandler(authProvider)
            },
        },
        {
            provide: GetMeQuery,
            inject: [SqlConnection],
            useFactory: (knex: Knex) => {
                return new knexGetMeQuery(knex)
            },
        },
    ],
    exports: [RegisterHandler, LoginHandler, LogoutHandler, GetMeQuery],
})
export class IAMUseCaseModule {}
