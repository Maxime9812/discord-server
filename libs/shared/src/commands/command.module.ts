import { Global, Module } from '@nestjs/common'
import { CommandBus } from './command-bus'
import { InMemoryCommandBus } from './in-memory-command-bus'

@Global()
@Module({
    providers: [
        {
            provide: CommandBus,
            useClass: InMemoryCommandBus,
        },
    ],
    exports: [CommandBus],
})
export class CommandModule {}
