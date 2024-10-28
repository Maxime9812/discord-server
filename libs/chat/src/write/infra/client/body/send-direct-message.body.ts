import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, MaxLength } from 'class-validator'

export class SendDirectMessageBody {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    public receiverId: string

    @ApiProperty({
        example: 'Hello world !',
    })
    @MaxLength(500)
    public content: string
}
