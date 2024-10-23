import { Chatter } from '../domain'

export type ChatterRepository = {
    byId: (id: string) => Promise<Chatter>
}
