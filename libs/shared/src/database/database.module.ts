import { Module } from '@nestjs/common'
import knexConfig from './knexfile'
import knex from 'knex'

export const SqlConnection = Symbol('SqlConnection')

@Module({
    providers: [
        {
            provide: SqlConnection,
            useFactory() {
                return knex(knexConfig.development)
            },
        },
    ],
    exports: [SqlConnection],
})
export class DatabaseModule {}
