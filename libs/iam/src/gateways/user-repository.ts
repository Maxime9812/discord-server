import { User } from '../domain'

export type UserRepository = {
    save: (user: User) => Promise<void>
    existsByUsername: (username: string) => Promise<boolean>
}

export const UserRepository = Symbol('UserRepository')
