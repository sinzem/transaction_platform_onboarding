import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class ReplenishmentDto {

    @ApiProperty({example: "0123456789012345", description: "Card number"}) 
    @IsString({message: "This should be a string"}) 
    @Length(16, 16, {message: "The card number length must be 16 characters, only numbers"}) 
    readonly cardNumber: string;

    @ApiProperty({example: "SKOROBOHATA MARIIA", description: "User initials"}) 
    @IsString({message: "This should be a string"}) 
    @Length(4, 100, {message: "The initials length must be from 4 to 100 characters"}) 
    readonly initials: string;

    @ApiProperty({example: "567", description: "Card CVC"}) 
    @IsString({message: "This should be a string"}) 
    @Length(3, 3, {message: 'The CVC code must be 3 characters, only numbers'}) 
    readonly cardCvc: string;

    @ApiProperty({example: "06/27", description: "Card expiry date"}) 
    @IsString({message: "This should be a string"}) 
    @Length(5, 5, {message: "It must be a string of 5 characters - the month and year digits separated by a bar"}) 
    readonly expiry: string;

    @ApiProperty({example: "+380990000000", description: "Phone number"}) 
    @IsString({message: "This should be a string"}) 
    @Length(13, 13, {message: 'The telephone number must consist of a "+" sign and twelve digits'}) 
    readonly phone: string;

    @ApiProperty({example: "name@gmail.com", description: "Email address"}) 
    @IsString({message: "This should be a string"}) 
    @IsEmail({}, {message: "Incorrect email address"}) 
    readonly email: string;

    @ApiProperty({example: "1234.00", description: "Amount of money"}) 
    @IsString({message: "This should be a string"}) 
    readonly sum: string;
}