import { User } from '../domain'

export type AuthProvider = {
    login: (user: User) => Promise<void>
}

export const AuthProvider = Symbol('AuthProvider')
