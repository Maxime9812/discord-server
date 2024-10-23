import { DomainError } from '@app/shared'

export class MessageNotFoundError extends DomainError {
    constructor(id: string) {
        super(`Message not found: ${id}`)
    }
}

export class MessageWasNotSentByChatterError extends DomainError {
    constructor() {
        super('Chatter is not the emitter of this message')
    }
}

export class MessageAlreadyDeletedError extends DomainError {
    constructor() {
        super('Message is already deleted')
    }
}
