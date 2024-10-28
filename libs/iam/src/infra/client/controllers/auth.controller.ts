import { CommandBus } from '@app/shared'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginBody, RegisterBody } from '../body'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private commandBus: CommandBus) {}

    @Post('login')
    async login(@Body() body: LoginBody) {
        return
    }

    @Post('logout')
    async logout() {
        return
    }

    @Post('register')
    async register(@Body() body: RegisterBody) {
        return
    }

    @Get('me')
    async me() {
        return
    }
}
