import { PasswordEncryption } from './password-encryption'

export class DeterministicPasswordEncryption implements PasswordEncryption {
    private _hash: Map<string, string> = new Map()

    async hash(password: string) {
        return this._hash.get(password) || ''
    }

    givenHash(password: string, hash: string) {
        return this._hash.set(password, hash)
    }
}
