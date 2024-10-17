import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class UpdateUserDto {

    @ApiProperty({example: "1", description: "User ID for searching in the database"}) 
    readonly id: number;

    @ApiProperty({example: "Kamala", description: "User name"}) 
    // @IsString({message: "This should be a string") 
    // @Length(2, 20, {message: "Length from 2 to 20 characters"}) 
    readonly name: string;

    @ApiProperty({example: "Harris", description: "User surname"}) 
    // @IsString({message: "This should be a string"}) 
    // @Length(2, 20, {message: "Length from 2 to 20 characters"}) 
    readonly surname: string;

    @ApiProperty({example: "+30990000000", description: "Phone number"}) 
    // @IsString({message: "This should be a string"}) 
    // @Length(12, 12, {message: "Length 12 characters"}) 
    readonly phone: string;

    @ApiProperty({example: "name@gmail.com", description: "Email address"}) 
    // @IsString({message: "This should be a string"}) 
    // @IsEmail({}, {message: "Incorrect email address"}) 
    readonly email: string;

    @ApiProperty({example: "12345678", description: "Password"}) 
    // @IsString({message: "This should be a string"}) 
    // @Length(4, 16, {message: "Length from 4 to 16 characters"}) 
    readonly password: string;
}