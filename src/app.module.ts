import { ChatModule } from '@app/chat'
import { IamModule } from '@app/iam'
import { SharedModule } from '@app/shared'
import { Module } from '@nestjs/common'

@Module({
    imports: [SharedModule, ChatModule, IamModule],
})
export class AppModule {}
