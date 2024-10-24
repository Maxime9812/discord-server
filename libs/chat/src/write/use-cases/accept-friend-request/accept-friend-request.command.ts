import { Command } from '@app/shared'

export type AcceptFriendRequestPayload = {
    requestId: string
    userId: string
}

export class AcceptFriendRequestCommand extends Command<AcceptFriendRequestPayload> {}
