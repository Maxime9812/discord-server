import { Command } from './command'
import { CommandHandler } from './command-handler'

export abstract class CommandBus {
    abstract registerHandler<T extends Command<unknown>>(
        command: new (payload: any) => T,
        handler: CommandHandler<T>
    ): void

    abstract execute<P>(command: Command<P>): Promise<void>
}
