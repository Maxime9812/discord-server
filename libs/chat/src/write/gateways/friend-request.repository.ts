import { UserSocial } from '../domain/user-social'

export type UserSocialRepository = {
    byId(id: string): Promise<UserSocial | undefined>
    save(social: UserSocial): Promise<void>
}
