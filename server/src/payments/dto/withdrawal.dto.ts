import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class WithdrawalDto {

    @ApiProperty({example: "Kamala", description: "User name"}) 
    @IsString({message: "This should be a string"}) 
    @Length(2, 20, {message: "The name length must be from 2 to 20 characters"}) 
    readonly name: string;

    @ApiProperty({example: "0123456789012345", description: "Card number"}) 
    @IsString({message: "This should be a string"}) 
    @Length(16, 16, {message: "The card number length must be 16 characters, only numbers"}) 
    readonly cardNumber: string;

    @ApiProperty({example: "name@gmail.com", description: "Email address"}) 
    @IsString({message: "This should be a string"}) 
    @IsEmail({}, {message: "Incorrect email address"}) 
    readonly email: string;

    @ApiProperty({example: "1234.00", description: "Amount of money"}) 
    @IsString({message: "This should be a string"}) 
    readonly sum: string;
}