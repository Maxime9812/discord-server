import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginBody, RegisterBody } from '../body'
import {
    LoginHandler,
    RegisterCommand,
    RegisterHandler,
} from '@app/iam/use-cases'
import { Public } from '../metadata'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private loginHandler: LoginHandler,
        private registerHandler: RegisterHandler
    ) {}

    @Public()
    @Post('login')
    async login(@Body() body: LoginBody) {
        this.loginHandler.handle(body)
    }

    @Post('logout')
    async logout() {
        return
    }

    @Public()
    @Post('register')
    async register(@Body() body: RegisterBody) {
        this.registerHandler.handle(body)
    }

    @Get('me')
    async me() {
        return
    }
}
