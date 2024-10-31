import { Module } from '@nestjs/common'
import { AuthController } from './infra'
import { IAMUseCaseModule } from './iam-usecase.modules'

@Module({
    imports: [IAMUseCaseModule],
    controllers: [AuthController],
})
export class IamModule {}
