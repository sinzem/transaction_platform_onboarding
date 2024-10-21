import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginAuthDto {

    @ApiProperty({example: "name@gmail.com", description: "User email address"}) 
    @IsString({message: "This should be a string"}) 
    @IsEmail({}, {message: "Incorrect email address"}) 
    readonly email: string;

    @ApiProperty({example: "12345hello", description: "Password"}) 
    @IsString({message: "This should be a string"}) 
    @Length(5, 30, {message: "The password length must be from 5 to 32 characters"}) 
    readonly password: string;

}