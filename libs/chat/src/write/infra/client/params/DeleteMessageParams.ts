import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class DeleteMessageParams {
    @ApiProperty({
        example: 'ebb20b62-eb68-4abd-8597-a77f9b1affe9',
    })
    @IsUUID()
    messageId: string
}
