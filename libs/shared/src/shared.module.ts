import { Module } from '@nestjs/common'
import { CommandModule } from './commands/command.module'
import { EventBusModule } from './events'

@Module({
    imports: [CommandModule, EventBusModule],
})
export class SharedModule {}
