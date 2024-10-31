import { User } from '../domain'

export type UserRepository = {
    save: (user: User) => Promise<void>
    getByUsername: (username: string) => Promise<User>
    existsByUsername: (username: string) => Promise<boolean>
}

export const UserRepository = Symbol('UserRepository')
