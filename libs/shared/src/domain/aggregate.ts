import { DomainEvent } from '../events'

export abstract class Aggregate<Props> {
    private domainEvents: DomainEvent<unknown>[] = []
    constructor(protected props: Props) {}

    getDomainEvents() {
        const domainEvents = this.domainEvents
        this.domainEvents = []
        return domainEvents
    }

    protected emitEvent(event: DomainEvent<unknown>) {
        this.domainEvents.push(event)
    }
}
