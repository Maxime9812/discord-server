import { createFixture, Fixture, userBuilder } from '@app/iam/__tests__'
import { UsernameAlreadyExistsError } from '@app/iam/domain'

describe('Feature: Register new user', () => {
    let fixture: Fixture

    beforeEach(() => {
        fixture = createFixture()
    })

    test('Can register a new user', async () => {
        fixture.givenHash('password', 'password-encrypted')
        fixture.givenId('user-id')
        fixture.givenNow(new Date('2024-10-23'))

        await fixture.whenRegister({
            username: 'maxime',
            password: 'password',
        })

        fixture.thenUsersShouldBe([
            userBuilder()
                .withId('user-id')
                .withUsername('maxime')
                .withPassword('password-encrypted')
                .build(),
        ])
    })

    test('Can NOT register a user with an existing username', async () => {
        fixture.givenUsers([userBuilder().withUsername('maxime').build()])

        await fixture.whenRegister({
            username: 'maxime',
            password: 'password',
        })

        fixture.thenErrorShouldBe(new UsernameAlreadyExistsError('maxime'))
    })

    test('User is logged in after registration', async () => {
        const user = userBuilder()
            .withId('user-id')
            .withUsername('maxime')
            .withPassword('password-encrypted')
            .registeredAt(new Date('2024-10-23'))
            .build()

        fixture.givenHash('password', 'password-encrypted')
        fixture.givenId('user-id')
        fixture.givenNow(new Date('2024-10-23'))

        await fixture.whenRegister({
            username: 'maxime',
            password: 'password',
        })

        fixture.thenUserIsLoggedIn(user)
    })
})
