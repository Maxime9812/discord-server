export type IdProvider = {
    generate: () => string
}

export const IdProvider = Symbol('IdProvider')
