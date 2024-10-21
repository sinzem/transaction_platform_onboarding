import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateRoleDto {
    @ApiProperty({example: "USER", description: "Role name"}) 
    @IsString({message: "This should be a string"}) 
    @Length(2, 20, {message: "The role name length must be from 2 to 20 characters"}) 
    readonly value: string;

    @ApiProperty({example: "Regular user", description: "Role description"}) 
    @IsString({message: "This should be a string"}) 
    @Length(2, 1000, {message: "The description length must be from 2 to 1000 characters"}) 
    readonly description: string;
}