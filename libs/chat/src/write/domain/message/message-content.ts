import { DomainError } from '@app/shared'

export class MessageContentTooLongError extends DomainError {
    constructor() {
        super('Message content is too long it must be 500 characters maximum.')
    }
}

export class MessageContent {
    private constructor(private content: string) {}

    get value() {
        return this.content
    }

    static from(content: string) {
        if (content.length > 500) {
            throw new MessageContentTooLongError()
        }

        return new MessageContent(content)
    }
}
