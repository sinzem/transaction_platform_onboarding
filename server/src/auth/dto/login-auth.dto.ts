import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginAuthDto {

    @ApiProperty({example: "name@gmail.com", description: "User email address"}) 
    // @IsString({message: "This should be a string") 
    // @Length(2, 20, {message: "Length from 2 to 20 characters"}) 
    readonly email: string;

    @ApiProperty({example: "12345hello", description: "Password"}) 
    // @IsString({message: "This should be a string"}) 
    // @IsEmail({}, {message: "Incorrect email address"}) 
    readonly password: string;

}