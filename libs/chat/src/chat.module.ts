import { Module } from '@nestjs/common'
import { ChatWriteModule } from './write/infra'

@Module({
    imports: [ChatWriteModule],
})
export class ChatModule {}
