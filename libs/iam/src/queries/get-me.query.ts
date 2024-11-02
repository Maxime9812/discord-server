export type Me = {
    id: string
    username: string
}

export type GetMeQuery = {
    execute: (userId: string) => Promise<Me>
}

export const GetMeQuery = Symbol('GetMeQuery')
