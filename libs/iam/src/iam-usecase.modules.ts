import { Module } from '@nestjs/common'
import { IAMDependenciesModule } from './iam-dependencies.module'
import {
    LoginCommand,
    LoginHandler,
    LogoutCommand,
    LogoutHandler,
    RegisterCommand,
    RegisterHandler,
} from './usecases'
import { CommandBus } from '@app/shared'

@Module({
    imports: [IAMDependenciesModule],
    providers: [
        {
            provide: RegisterHandler,
            useFactory: () => {
                return new RegisterHandler()
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
