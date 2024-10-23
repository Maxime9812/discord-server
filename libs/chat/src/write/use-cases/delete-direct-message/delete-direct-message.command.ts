import { Command } from '@app/shared'

export type DeleteDirectMessagePayload = {
    id: string
    chatterId: string
}

export class DeleteDirectMessageCommand extends Command<DeleteDirectMessagePayload> {}
