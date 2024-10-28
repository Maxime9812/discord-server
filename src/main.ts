import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: {
            credentials: true,
            origin: true,
        },
    })

    const config = new DocumentBuilder()
        .setTitle('Discord server')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('doc', app, documentFactory)

    app.useGlobalPipes(new ValidationPipe())
    app.useStaticAssets('public')
    await app.listen(3000)
}
bootstrap()
