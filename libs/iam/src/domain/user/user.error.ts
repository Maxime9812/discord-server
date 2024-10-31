import { DomainError } from '@app/shared'

export class UsernameAlreadyExistsError extends DomainError {
    constructor(username: string) {
        super(`Username "${username}" is already taken`)
    }
}

export class UserPasswordDoesNotMatchError extends DomainError {
    constructor() {
        super('User password does not match')
    }
}
