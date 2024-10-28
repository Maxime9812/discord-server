import { Module } from '@nestjs/common'
import { IAMDependenciesModule } from './iam-dependencies.module'

@Module({
    imports: [IAMDependenciesModule],
    providers: [],
})
export class IAMUseCaseModule {}
