import { Chatter, ChatterSnapshot } from '@app/chat/write/domain'
import { ChatterRepository } from '@app/chat/write/gateways'

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
