import { SendDirectMessageCommand } from "@app/chat/write/use-cases";
import { CommandBus } from "@app/shared/commands/command-bus";
import { Controller, Post } from "@nestjs/common";

@Controller("chat")
export class ChatController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post("/send-message")
    async sendMessage() {
        await this.commandBus.execute(
            new SendDirectMessageCommand({
                to: "1",
                content: "Hello",
            }),
        );
    }
}
