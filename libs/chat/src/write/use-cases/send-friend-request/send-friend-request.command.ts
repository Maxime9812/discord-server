import { Command } from '@app/shared'

export type SendFriendRequestPaylaod = {
    requestId: string
    senderId: string
    receiverId: string
}

export class SendFriendRequestCommand extends Command<SendFriendRequestPaylaod> {}
