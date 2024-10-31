export type PasswordHasher = {
    hash: (password: string) => string
    compare: (password: string, hash: string) => boolean
}

export const PasswordHasher = Symbol('PasswordHasher')
