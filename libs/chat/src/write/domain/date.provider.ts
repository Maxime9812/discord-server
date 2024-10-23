export type DateProvider = {
    getNow: () => Date
}

export const DateProvider = Symbol('DateProvider')
