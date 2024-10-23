import { Module } from '@nestjs/common'
import { ChatController } from './controllers/chat.controller'
import { ChatWriteUsecasesModule } from './chat-write-usecases.module'

@Module({
    imports: [ChatWriteUsecasesModule],
    controllers: [ChatController],
})
export class ChatWriteModule {}
