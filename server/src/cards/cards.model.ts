import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

import { User } from "src/users/users.model";

interface UserCardAttrs {
    userId: number;
    cardNumber: string;
    cardNumberHidden: string;
    initials: string;
    cardCvc: string;
    expiry: string;
} 

@Table({tableName: "cards"}) 
export class Card extends Model<Card, UserCardAttrs> {

    @ApiProperty({example: "1", description: "Unique identifier"}) 
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: "1", description: "Unique user ID"}) 
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    @ApiProperty({example: "0000000000000000", description: "Card number"}) 
    @Column({type: DataType.STRING, allowNull: false})
    cardNumber: string;

    @ApiProperty({example: "************0000", description: "Card number"}) 
    @Column({type: DataType.STRING, allowNull: false})
    cardNumberHidden: string;

    @ApiProperty({example: "95400.00", description: "Balance on the card"}) 
    @Column({type: DataType.STRING, defaultValue: "0"})
    cardBalance: string;

    @ApiProperty({example: "SKOROBOHATA MARIIA", description: "User initials"}) 
    @Column({type: DataType.STRING, allowNull: false})
    initials: string;

    @ApiProperty({example: "345", description: "Card CVC"}) 
    @Column({type: DataType.STRING, allowNull: false})
    cardCvc: string;

    @ApiProperty({example: "04/25", description: "Expiry date"}) 
    @Column({type: DataType.STRING, allowNull: false})
    expiry: string;

    @BelongsTo(() => User, { onDelete: "CASCADE" }) 
    cards: User;
} 