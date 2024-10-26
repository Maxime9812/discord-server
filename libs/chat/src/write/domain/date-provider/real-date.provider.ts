import { DateProvider } from './date.provider'

export class RealDateProvider implements DateProvider {
    getNow() {
        return new Date()
    }
}
