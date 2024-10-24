import { UserSocial } from '../domain'

export type UserSocialRepository = {
    byId(id: string): Promise<UserSocial | undefined>
    save(social: UserSocial): Promise<void>
}

export const UserSocialRepository = Symbol('UserSocialRepository')
