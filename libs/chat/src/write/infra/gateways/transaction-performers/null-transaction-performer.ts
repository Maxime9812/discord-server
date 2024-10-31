import {
    GenericTransaction,
    TransactionPerformer,
} from '@app/chat/write/gateways'

export class NullTransformationPerformer implements TransactionPerformer {
    async perform<T>(
        useCase: (trx: GenericTransaction) => Promise<T>
    ): Promise<T> {
        return useCase(null)
    }
}
