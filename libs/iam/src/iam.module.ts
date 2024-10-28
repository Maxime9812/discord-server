import { Module } from '@nestjs/common'
import { AuthController } from './infra'

@Module({
    providers: [],
    controllers: [AuthController],
    exports: [],
})
export class IamModule {}
