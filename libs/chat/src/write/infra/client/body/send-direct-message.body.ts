import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, MaxLength } from 'class-validator'

export class SendDirectMessageBody {
    @ApiProperty({
        example: 'f0dbb6ec-b8cb-46c6-995e-af06a5236dac',
    })
    @IsUUID()
    public receiverId: string

    @ApiProperty({
        example: 'Hello world !',
    })
    @MaxLength(500)
    public content: string
}
