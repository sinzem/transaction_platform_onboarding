import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class TransformRoleDto {

    @ApiProperty({example: "USER", description: "Role name"}) 
    // @IsString({message: "This should be a string") 
    // @Length(2, 20, {message: "Length from 2 to 20 characters"}) 
    readonly role: string;

    @ApiProperty({example: "name@gmail.com", description: "Email address"}) 
    // @IsString({message: "This should be a string"}) 
    // @IsEmail({}, {message: "Incorrect email address"}) 
    readonly email: string;

}