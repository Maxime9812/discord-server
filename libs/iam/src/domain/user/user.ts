type UserProps = {
    id: string
    username: string
    password: string
    registeredAt: Date
}

export type UserSnapshot = User['snapshot']

export class User {
    private constructor(private props: UserProps) {}

    get id() {
        return this.props.id
    }

    get password() {
        return this.props.password
    }

    get snapshot() {
        return {
            id: this.props.id,
            username: this.props.username,
            password: this.props.password,
            registeredAt: this.props.registeredAt,
        }
    }

    static create({
        id,
        username,
        password,
        currentDate,
    }: {
        id: string
        username: string
        password: string
        currentDate: Date
    }) {
        return new User({
            id,
            username,
            password,
            registeredAt: currentDate,
        })
    }

    static fromSnapshot(snapshot: UserSnapshot) {
        return new User(snapshot)
    }
}
