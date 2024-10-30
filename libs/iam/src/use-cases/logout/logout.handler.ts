import { CommandHandler } from '@app/shared'
import { LogoutCommand } from './logout.command'

export class LogoutHandler implements CommandHandler<LogoutCommand> {
    handle(): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
