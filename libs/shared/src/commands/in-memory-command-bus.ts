import { Command } from './command'
import { CommandHandler } from './command-handler'
import { CommandBus } from './command-bus'

export class InMemoryCommandBus implements CommandBus {
    private handlers = new Map<
        new (payload: any) => unknown,
        CommandHandler<Command<unknown>>
    >()

    registerHandler<T extends Command<unknown>>(
        command: new (payload: any) => T,
        handler: CommandHandler<T>
    ) {
        if (this.handlers.has(command)) {
            throw new Error(
                `A handler for ${command.name} is already registered`
            )
        }

        this.handlers.set(command, handler)
        return this
    }

    async execute<P>(command: Command<P>) {
        const handler = this.handlers.get(
            command.constructor as new (payload: P) => Command<P>
        )
        if (!handler) {
            throw new Error(`No handler registered for command: ${command}`)
        }
        return handler.handle(command.payload)
    }
}
