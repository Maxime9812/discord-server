import * as bcrypt from 'bcrypt'
import { PasswordHasher } from './password-hasher'

export class BcryptPasswordHasher implements PasswordHasher {
    hash(password: string): string {
        return bcrypt.hashSync(password, 10)
    }
}
