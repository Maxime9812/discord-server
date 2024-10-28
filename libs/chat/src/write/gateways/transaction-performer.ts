export interface GenericTransaction {}

export type TransactionableAsync<T = void> = (
    trx: GenericTransaction
) => Promise<T>

export interface TransactionPerformer {
    perform<T>(useCase: (trx: GenericTransaction) => Promise<T>): Promise<T>
}
