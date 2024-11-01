import { createFixture, Fixture, userBuilder } from '@app/iam/__tests__'

describe('Feature: Logout', () => {
    let fixture: Fixture

    beforeEach(() => {
        fixture = createFixture()
    })

    test('User is logged out', async () => {
        const user = userBuilder().withId('1').build()
        fixture.givenUserIsLoggedIn(user)

        await fixture.whenLogout()

        fixture.thenUserIsLoggedOut()
    })
})
