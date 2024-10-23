import { Module } from '@nestjs/common'
import { ChatWriteModule } from './write/infra/client/chat-write.module'

@Module({
    imports: [ChatWriteModule],
})
export class ChatModule {}
