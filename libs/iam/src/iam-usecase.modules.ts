import { Module } from '@nestjs/common'
import { IAMDependenciesModule } from './iam-dependencies.module'
import { LoginHandler, LogoutHandler, RegisterHandler } from './use-cases'
import { CommandBus } from '@app/shared'
import { AuthProvider, UserRepository } from './gateways'
import { DateProvider, IdProvider, PasswordHasher } from './domain'

@Module({
    imports: [IAMDependenciesModule],
    providers: [
        {
            provide: RegisterHandler,
            inject: [UserRepository, PasswordHasher, IdProvider, DateProvider],
            useFactory: (
                userRepository: UserRepository,
                passwordEncryption: PasswordHasher,
                idProvider: IdProvider,
                dateProvider: DateProvider
            ) => {
                return new RegisterHandler(
                    userRepository,
                    passwordEncryption,
                    idProvider,
                    dateProvider
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
    ],
    exports: [RegisterHandler, LoginHandler, LogoutHandler],
})
export class IAMUseCaseModule {}
