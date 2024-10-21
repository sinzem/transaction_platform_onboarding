import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {

    @ApiProperty({example: "Kamala", description: "User name"}) 
    @IsString({message: "This should be a string"}) 
    @Length(2, 20, {message: "The name length must be from 2 to 20 characters"}) 
    readonly name: string;

    @ApiProperty({example: "Harris", description: "User surname"}) 
    @IsString({message: "This should be a string"}) 
    @Length(2, 20, {message: "The surname length must be from 2 to 20 characters"}) 
    readonly surname: string;

    @ApiProperty({example: "+380990000000", description: "Phone number"}) 
    @IsString({message: "This should be a string"}) 
    @Length(13, 13, {message: 'The telephone number must consist of a "+" sign and twelve digits'}) 
    readonly phone: string;

    @ApiProperty({example: "name@gmail.com", description: "Email address"}) 
    @IsString({message: "This should be a string"}) 
    @IsEmail({}, {message: "Incorrect email address"}) 
    readonly email: string;

    @ApiProperty({example: "12345678", description: "Password"}) 
    @IsString({message: "This should be a string"}) 
    @Length(5, 32, {message: "The password length must be from 5 to 32 characters"}) 
    readonly password: string;
}