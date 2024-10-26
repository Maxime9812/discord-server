import { Module } from '@nestjs/common'
import { ChatController } from './controllers/chat.controller'
import { ChatWriteUsecasesModule } from './chat-write-usecases.module'
import { SocialController } from './controllers/social.controller'

@Module({
    imports: [ChatWriteUsecasesModule],
    controllers: [ChatController, SocialController],
})
export class ChatWriteModule {}
