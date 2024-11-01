import { Body, Controller, Get, Post, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginBody, RegisterBody } from '../body'
import {
    LoginHandler,
    LogoutHandler,
    RegisterHandler,
} from '@app/iam/use-cases'
import { Public } from '../metadata'
import { Response } from 'express'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private loginHandler: LoginHandler,
        private registerHandler: RegisterHandler,
        private logoutHandler: LogoutHandler
    ) {}

    @Public()
    @Post('login')
    async login(@Body() body: LoginBody) {
        await this.loginHandler.handle(body)
    }

    @Public()
    @Post('logout')
    async logout(@Res() res: Response) {
        await this.logoutHandler.handle()
        res.clearCookie('session')
        res.json()
    }

    @Public()
    @Post('register')
    async register(@Body() body: RegisterBody) {
        await this.registerHandler.handle(body)
    }

    @Get('me')
    async me() {
        return
    }
}
