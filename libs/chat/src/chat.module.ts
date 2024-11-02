import { Module } from '@nestjs/common'
import { ReadChatModule } from './read/infra/read-chat.module'
import { ChatWriteModule } from './write'

@Module({
    imports: [ChatWriteModule, ReadChatModule],
})
export class ChatModule {}
