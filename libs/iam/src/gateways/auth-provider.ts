import { User } from '../domain'

export type AuthUser = {
    id: string
}

export type AuthProvider = {
    login: (user: User) => Promise<void>
    logout: () => Promise<void>
}

export const AuthProvider = Symbol('AuthProvider')
