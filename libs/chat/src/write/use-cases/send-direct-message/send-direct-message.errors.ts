import { DomainError } from '@app/shared'

export class ChatterNotFoundError extends DomainError {
    constructor(chatterId: string) {
        super(`Chatter with id ${chatterId} not found`)
    }
}
