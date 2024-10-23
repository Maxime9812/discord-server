import { Chatter, ChatterSnapshot } from '../../domain'
import { ChatterRepository } from '../../gateways'

export class InMemoryChatterRepository implements ChatterRepository {
    private chatters: Map<string, ChatterSnapshot> = new Map()

    async byId(id: string): Promise<Chatter | undefined> {
        const snapshot = this.chatters.get(id)
        if (snapshot) {
            return Chatter.fromSnapshot(snapshot)
        }
    }

    givenChatters(chatters: Chatter[]) {
        chatters.forEach((chatter) => {
            this.chatters.set(chatter.id, chatter.snapshot)
        })
    }
}
