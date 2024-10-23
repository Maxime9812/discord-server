import { DomainError } from '@app/shared'

export class MessageNotFoundError extends DomainError {
    constructor(id: string) {
        super(`Message not found: ${id}`)
    }
}
