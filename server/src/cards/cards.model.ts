import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

import { User } from "src/users/users.model";

interface UserCardAttrs {
    userId: number;
    cardNumber: number;
    initials: string;
    cardCvc: number;
    expiry: string;
} 

@Table({tableName: "cards"}) 
export class Card extends Model<Card, UserCardAttrs> {

    @ApiProperty({example: "1", description: "Unique identifier"}) 
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: "1", description: "Unique user ID"}) 
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ApiProperty({example: "0000000000000000", description: "Card number"}) 
    @Column({type: DataType.INTEGER, allowNull: false})
    cardNumber: number;

    @ApiProperty({example: "SKOROBOHATA M", description: "User initials"}) 
    @Column({type: DataType.STRING, allowNull: false})
    initials: string;

    @ApiProperty({example: "345", description: "Card CVC"}) 
    @Column({type: DataType.INTEGER, allowNull: false})
    cardCvc: number;

    @ApiProperty({example: "04/25", description: "Expiry date"}) 
    @Column({type: DataType.STRING, allowNull: false})
    expiry: string;

    @BelongsTo(() => User, { onDelete: "CASCADE" }) 
    cards: User;
} 