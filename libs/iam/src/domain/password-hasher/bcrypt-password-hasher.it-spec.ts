import { BcryptPasswordHasher } from './bcrypt-password-hasher'

describe('BcryptPasswordHasher', () => {
    let bcryptPasswordHasher: BcryptPasswordHasher

    beforeEach(() => {
        bcryptPasswordHasher = new BcryptPasswordHasher()
    })

    test('hash', () => {
        const password = 'password'
        const hashedPassword = bcryptPasswordHasher.hash(password)
        expect(hashedPassword).not.toBe(password)
    })

    test('compare', () => {
        const password = 'password'
        const hashedPassword = bcryptPasswordHasher.hash(password)
        const isPasswordValid = bcryptPasswordHasher.compare(
            password,
            hashedPassword
        )
        expect(isPasswordValid).toBeTruthy()
    })
})
