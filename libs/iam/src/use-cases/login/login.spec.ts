import { createFixture, Fixture, userBuilder } from '@app/iam/__tests__'
import { UserPasswordDoesNotMatchError } from '@app/iam/domain'

describe('Feature: Login with username and password', () => {
    let fixture: Fixture

    beforeEach(() => {
        fixture = createFixture()
    })

    test('User is successfully logged in', async () => {
        const john = userBuilder()
            .withUsername('johndoe')
            .withPassword('password-encrypted')
            .build()

        fixture.givenUsers([john])
        fixture.givenHash('password-encrypted', 'password')

        await fixture.whenLogin({
            username: 'johndoe',
            password: 'password',
        })

        fixture.thenUserIsLoggedIn(john)
    })

    test('User is not logged in with wrong password', async () => {
        const john = userBuilder()
            .withUsername('johndoe')
            .withPassword('password-encrypted')
            .build()

        fixture.givenHash('password-encrypted', 'password')
        fixture.givenUsers([john])

        await fixture.whenLogin({
            username: 'johndoe',
            password: 'wrong-password',
        })

        fixture.thenErrorShouldBe(new UserPasswordDoesNotMatchError())
    })
})
