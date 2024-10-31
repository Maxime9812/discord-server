export type PasswordEncryption = {
    hash: (password: string) => Promise<string>
}
