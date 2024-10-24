import { DomainError } from '@app/shared'

export class UserSocialAlreadyFriendsError extends DomainError {
    constructor(id: string) {
        super(`User already friends with ${id}`)
    }
}

export class UserSocialAlreadyRequestedError extends DomainError {
    constructor() {
        super('A request already exists')
    }
}
