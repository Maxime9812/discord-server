import { CommandHandler } from '@app/shared'
import { RegisterCommand, RegisterPayload } from './register.command'

export class RegisterHandler implements CommandHandler<RegisterCommand> {
    handle(command: RegisterPayload): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
