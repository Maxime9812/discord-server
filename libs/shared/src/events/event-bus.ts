export class DomainEvent<T> {
    constructor(public readonly payload?: T) {}
}

export interface EventBus {
    emit(event: DomainEvent<any>): void
    subscribe(
        event: DomainEvent<any>,
        callback: (event: DomainEvent<any>) => void
    ): void
}

export const EventBus = Symbol('EventBus')
