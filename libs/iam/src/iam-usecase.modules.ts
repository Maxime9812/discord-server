import { Module } from '@nestjs/common'
import { IAMDependenciesModule } from './iam-dependencies.module'
import {
    LoginCommand,
    LoginHandler,
    LogoutCommand,
    LogoutHandler,
    RegisterCommand,
    RegisterHandler,
} from './use-cases'
import { CommandBus } from '@app/shared'
import { UserRepository } from './gateways'
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
            useFactory: () => {
                return new LoginHandler()
            },
        },
        {
            provide: LogoutHandler,
            useFactory: () => {
                return new LogoutHandler()
            },
        },
    ],
})
export class IAMUseCaseModule {
    constructor(
        commandBus: CommandBus,
        registerHandler: RegisterHandler,
        loginHandler: LoginHandler,
        logoutHandler: LogoutHandler
    ) {
        commandBus
            .registerHandler(RegisterCommand, registerHandler)
            .registerHandler(LoginCommand, loginHandler)
            .registerHandler(LogoutCommand, logoutHandler)
    }
}
