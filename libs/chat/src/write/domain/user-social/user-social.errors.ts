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

export class UserSocialNotFoundError extends DomainError {
    constructor(id: string) {
        super(`User social with id ${id} not found`)
    }
}

export class UserSocialFriendRequestNotFound extends DomainError {
    constructor(id: string) {
        super(`Friend request with id ${id} not found`)
    }
}
