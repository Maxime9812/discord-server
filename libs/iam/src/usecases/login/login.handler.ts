import { CommandHandler } from '@app/shared'
import { LoginCommand, LoginPayload } from './login.command'

export class LoginHandler implements CommandHandler<LoginCommand> {
    handle(command: LoginPayload): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
