import { IdProvider } from './id-provider'
import * as crypto from 'crypto'

export class CryptoIdProvider implements IdProvider {
    generate() {
        return crypto.randomUUID()
    }
}
