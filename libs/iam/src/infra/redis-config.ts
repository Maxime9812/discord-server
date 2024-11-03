import { RedisOptions } from 'ioredis'

export const redisConfig: Record<
    'production' | 'development' | 'test',
    RedisOptions
> = {
    production: {
        host: 'redis',
        port: 6379,
    },
    development: {
        host: 'localhost',
        port: 6379,
    },
    test: {},
}
