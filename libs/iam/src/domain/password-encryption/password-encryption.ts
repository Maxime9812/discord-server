export type PasswordEncryption = {
    hash: (password: string) => Promise<string>
}

export const PasswordEncryption = Symbol('PasswordEncryption')
