import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthController } from './infra'
import { IAMUseCaseModule } from './iam-usecase.modules'
import { IAMDependenciesModule, SessionsStore } from './iam-dependencies.module'
import * as session from 'express-session'
import { Store } from 'express-session'

@Module({
    imports: [IAMDependenciesModule, IAMUseCaseModule],
    controllers: [AuthController],
})
export class IamModule implements NestModule {
    constructor(@Inject(SessionsStore) private readonly store: Store) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session({
                    store: this.store,
                    secret: 'keyboard cat',
                    resave: false,
                    saveUninitialized: false,
                    name: 'session',
                    cookie: {
                        httpOnly: true,
                        domain: 'localhost',
                    },
                })
            )
            .forRoutes('*')
    }
}
