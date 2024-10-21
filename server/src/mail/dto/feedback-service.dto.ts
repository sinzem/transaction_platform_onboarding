import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class FeedbackDto {

    @ApiProperty({example: "Kamala", description: "User name"}) 
    @IsString({message: "This should be a string"}) 
    @Length(2, 20, {message: "The name length must be from 2 to 20 characters"}) 
    readonly name: string;

    @ApiProperty({example: "name@gmail.com", description: "Email address"}) 
    @IsString({message: "This should be a string"}) 
    @IsEmail({}, {message: "Incorrect email address"}) 
    readonly mail: string

    @ApiProperty({example: "Kamala", description: "User name"}) 
    readonly text: string;

}