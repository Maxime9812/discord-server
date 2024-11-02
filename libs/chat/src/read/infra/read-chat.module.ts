import { Module } from '@nestjs/common'
import { ReadChatController, ReadSocialController } from './controllers'
import { NotifyMessageSent } from '../use-cases'

@Module({
    controllers: [ReadChatController, ReadSocialController],
    providers: [
        {
            provide: NotifyMessageSent,
            useClass: NotifyMessageSent,
        },
    ],
})
export class ReadChatModule {}
