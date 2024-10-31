import { PasswordHasher } from './password-hasher'

export class DeterministicPasswordEncryption implements PasswordHasher {
    private _hash: Map<string, string> = new Map()

    hash(password: string) {
        return this._hash.get(password) || ''
    }

    givenHash(password: string, hash: string) {
        return this._hash.set(password, hash)
    }
}
