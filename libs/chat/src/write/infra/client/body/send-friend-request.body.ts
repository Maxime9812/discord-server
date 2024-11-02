import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class SendFriendRequestBody {
    @ApiProperty({
        example: 'f0dbb6ec-b8cb-46c6-995e-af06a5236dac',
    })
    @IsUUID()
    receiverId: string
}
