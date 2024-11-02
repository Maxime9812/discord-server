import { DomainEvent, EventBus } from './event-bus'
import { EventEmitter2 } from '@nestjs/event-emitter'

export class NestEventBus implements EventBus {
    constructor(private readonly eventBus: EventEmitter2) {}
    emit(event: DomainEvent<any>): void {
        this.eventBus.emit(event.constructor.name, event)
    }

    subscribe<T>(event: DomainEvent<T>, callback: (payload: T) => void): void {
        this.eventBus.on(event.constructor.name, callback)
    }
}
