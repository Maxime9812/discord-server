import { CommandBus } from '@app/shared'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginBody, RegisterBody } from '../body'
import { LoginCommand, RegisterCommand } from '@app/iam/use-cases'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private commandBus: CommandBus) {}

    @Post('login')
    async login(@Body() body: LoginBody) {
        this.commandBus.execute(new LoginCommand(body))
    }

    @Post('logout')
    async logout() {
        return
    }

    @Post('register')
    async register(@Body() body: RegisterBody) {
        this.commandBus.execute(new RegisterCommand(body))
    }

    @Get('me')
    async me() {
        return
    }
}
