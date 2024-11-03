import * as bcrypt from 'bcryptjs'
import { PasswordHasher } from './password-hasher'

export class BcryptPasswordHasher implements PasswordHasher {
    hash(password: string): string {
        return bcrypt.hashSync(password, 10)
    }

    compare(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash)
    }
}
