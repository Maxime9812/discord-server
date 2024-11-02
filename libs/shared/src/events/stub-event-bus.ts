import { DomainEvent, EventBus } from './event-bus'

export class StubEventBus implements EventBus {
    private _emittedEvent: DomainEvent<any>
    emit(event: DomainEvent<any>): void {
        this._emittedEvent = event
    }

    subscribe(
        event: DomainEvent<any>,
        callback: (event: DomainEvent<any>) => void
    ): void {}

    get emittedEvent(): DomainEvent<any> {
        return this._emittedEvent
    }
}
