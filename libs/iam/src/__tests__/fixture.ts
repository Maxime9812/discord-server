import {
    DeterministicDateProvider,
    DeterministicIdProvider,
    DeterministicPasswordEncryption,
    User,
} from '../domain'
import { InMemoryUserRepository } from '../infra'
import { RegisterHandler, RegisterPayload } from '../use-cases'

export const createFixture = () => {
    const userRepository = new InMemoryUserRepository()
    const passwordEncryption = new DeterministicPasswordEncryption()
    const idProvider = new DeterministicIdProvider()
    const dateProvider = new DeterministicDateProvider()
    const register = new RegisterHandler(
        userRepository,
        passwordEncryption,
        idProvider,
        dateProvider
    )
    let error: Error

    return {
        givenId(id: string) {
            idProvider.id = id
        },
        givenHash(password: string, hash: string) {
            passwordEncryption.givenHash(password, hash)
        },
        givenNow(now: Date) {
            dateProvider.now = now
        },
        givenUsers(users: User[]) {
            userRepository.givenUsers(users)
        },
        async whenRegister(payload: RegisterPayload) {
            try {
                await register.handle(payload)
            } catch (e) {
                error = e
            }
        },
        thenUsersShouldBe(expectedUsers: User[]) {
            expect(userRepository.getAll()).toEqual(
                expectedUsers.map((user) => user.snapshot)
            )
        },
        thenErrorShouldBe(expectedError: Error) {
            expect(error).toEqual(expectedError)
        },
    }
}

export type Fixture = ReturnType<typeof createFixture>
