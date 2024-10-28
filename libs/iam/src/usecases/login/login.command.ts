import { Command } from '@app/shared'

export type LoginPayload = {
    username: string
    password: string
}

export class LoginCommand extends Command<LoginPayload> {}
