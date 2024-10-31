import { DomainError } from '@app/shared'

export class UsernameAlreadyExistsError extends DomainError {
    constructor(username: string) {
        super(`Username "${username}" is already taken`)
    }
}
