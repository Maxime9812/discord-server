import { CommandHandler } from '@app/shared'
import { LoginCommand, LoginPayload } from './login.command'
import { AuthProvider, UserRepository } from '@app/iam/gateways'
import { PasswordHasher, UserPasswordDoesNotMatchError } from '@app/iam/domain'

export class LoginHandler implements CommandHandler<LoginCommand> {
    constructor(
        private userRepository: UserRepository,
        private authProvider: AuthProvider,
        private passwordHasher: PasswordHasher
    ) {}

    async handle(command: LoginPayload): Promise<void> {
        const user = await this.userRepository.getByUsername(command.username)

        const passwordMatches = this.passwordHasher.compare(
            user.password,
            command.password
        )

        if (!passwordMatches) {
            throw new UserPasswordDoesNotMatchError()
        }

        await this.authProvider.login(user)
    }
}
