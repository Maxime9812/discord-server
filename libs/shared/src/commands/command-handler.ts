import { Command } from './command'

export abstract class CommandHandler<C extends Command<unknown>, R = void> {
    abstract handle(command: C['payload']): Promise<R>
}
