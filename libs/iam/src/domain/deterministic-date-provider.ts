import { DateProvider } from './date-provider'

export class DeterministicDateProvider implements DateProvider {
    now: Date

    getNow() {
        return this.now
    }
}
