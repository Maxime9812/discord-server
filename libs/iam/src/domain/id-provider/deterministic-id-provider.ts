import { IdProvider } from './id-provider'

export class DeterministicIdProvider implements IdProvider {
    id: string

    generate() {
        return this.id
    }
}
