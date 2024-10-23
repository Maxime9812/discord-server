import { Command } from "@app/shared";

export type SendDirectMessagePayload = {
    messageId: string;
    emitterId: string;
    receiverId: string;
    content: string;
};

export class SendDirectMessageCommand
    extends Command<SendDirectMessagePayload> {}
