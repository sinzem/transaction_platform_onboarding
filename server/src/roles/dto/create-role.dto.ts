import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({example: "USER", description: "Role name"}) 
    readonly value: string;

    @ApiProperty({example: "Regular user", description: "Role description"}) 
    readonly description: string;
}