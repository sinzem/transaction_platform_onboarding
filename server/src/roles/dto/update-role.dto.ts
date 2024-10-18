import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoleDto {
    @ApiProperty({example: "1", description: "Role ID for searching in the database"}) 
    readonly id: number;

    @ApiProperty({example: "USER", description: "Role name"}) 
    readonly value: string;

    @ApiProperty({example: "Regular user", description: "Role description"}) 
    readonly description: string;
}