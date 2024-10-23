import { DomainError } from '@app/shared'

export class ChatterNotFriendWithReceiverError extends DomainError {
    constructor() {
        super('Chatters are not friends')
    }
}

export class ChatterNotFoundError extends DomainError {
    constructor(chatterId: string) {
        super(`Chatter with id ${chatterId} not found`)
    }
}
