import { Module } from '@nestjs/common'
import { ChatController, SocialController } from './controllers'
import { ChatWriteUsecasesModule } from './chat-write-usecases.module'

@Module({
    imports: [ChatWriteUsecasesModule],
    controllers: [ChatController, SocialController],
})
export class ChatWriteModule {}
