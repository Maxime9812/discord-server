export abstract class Command<P> {
    constructor(public readonly payload: P) {}
}
