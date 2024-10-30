import { Command } from '@app/shared'

export type RegisterPayload = {
    username: string
    password: string
}

export class RegisterCommand extends Command<RegisterPayload> {}
