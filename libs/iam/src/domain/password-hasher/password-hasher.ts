export type PasswordHasher = {
    hash: (password: string) => string
}

export const PasswordHasher = Symbol('PasswordHasher')
