import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginBody {
    @ApiProperty({
        example: 'john.doe',
    })
    @IsString()
    username: string

    @ApiProperty({
        example: 'password123',
    })
    @IsString()
    password: string
}
