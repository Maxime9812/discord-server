import { CommandHandler } from '@app/shared'
import { RegisterCommand, RegisterPayload } from './register.command'
import { AuthProvider, UserRepository } from '@app/iam/gateways'
import {
    DateProvider,
    IdProvider,
    PasswordHasher,
    User,
    UsernameAlreadyExistsError,
} from '@app/iam/domain'

export class RegisterHandler implements CommandHandler<RegisterCommand> {
    constructor(
        private userRepository: UserRepository,
        private passwordEncryption: PasswordHasher,
        private idProvider: IdProvider,
        private dateProvider: DateProvider,
        private authProvider: AuthProvider
    ) {}

    async handle(command: RegisterPayload): Promise<void> {
        await this.validateUsername(command.username)

        const user = User.create({
            id: this.idProvider.generate(),
            username: command.username,
            password: this.passwordEncryption.hash(command.password),
            currentDate: this.dateProvider.getNow(),
        })

        await this.userRepository.save(user)
        await this.authProvider.login(user)
    }

    private async validateUsername(username: string) {
        const usernameAlreadyExist =
            await this.userRepository.existsByUsername(username)

        if (usernameAlreadyExist) {
            throw new UsernameAlreadyExistsError(username)
        }
    }
}
