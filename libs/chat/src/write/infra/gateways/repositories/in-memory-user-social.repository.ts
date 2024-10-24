import { UserSocial, UserSocialSnapshot } from '@app/chat/write/domain'
import { UserSocialRepository } from '@app/chat/write/gateways'

export class InMemoryUserSocialRepository implements UserSocialRepository {
    private requests: Map<string, UserSocialSnapshot> = new Map()

    async save(social: UserSocial) {
        this.requests.set(social.id, social.snapshot)
    }

    async byId(id: string): Promise<UserSocial | undefined> {
        const snapshot = this.requests.get(id)

        if (!snapshot) {
            return undefined
        }

        return UserSocial.fromSnapshot(snapshot)
    }

    getAll() {
        return [...this.requests.values()]
    }

    givenUserSocials(socials: UserSocial[]) {
        socials.forEach((social) => {
            this.requests.set(social.id, social.snapshot)
        })
    }
}
