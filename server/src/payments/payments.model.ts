import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

import { User } from "src/users/users.model";

interface PaymentsAttrs {
    userId: number;
    payNumber: string;
    cardNumberHidden: string;
    status: string;
    sum: string;
    subscription: string;
    type: string;
} 

@Table({tableName: "payments"}) 
export class Payment extends Model<Payment, PaymentsAttrs> {

    @ApiProperty({example: "1", description: "Unique identifier"}) 
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: "1", description: "Unique user ID"}) 
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    @ApiProperty({example: "EKD40PR763W7", description: "Payment number"}) 
    @Column({type: DataType.STRING, allowNull: false})
    payNumber: string;

    @ApiProperty({example: "8430********0000", description: "Card number"}) 
    @Column({type: DataType.STRING, allowNull: false})
    cardNumberHidden: string;

    @ApiProperty({example: "completed", description: "Payment status"}) 
    @Column({type: DataType.STRING, allowNull: false})
    status: string;

    @ApiProperty({example: "128.99", description: "Payment amount"}) 
    @Column({type: DataType.STRING, allowNull: false})
    sum: string;

    @ApiProperty({example: "Bonus (annual)", description: "Subscription"}) 
    @Column({type: DataType.STRING, defaultValue: "ordinary"})
    subscription: string;

    @ApiProperty({example: "withdrawal", description: "Type of payment"}) 
    @Column({type: DataType.STRING, allowNull: false})
    type: string;

    @BelongsTo(() => User, { onDelete: "CASCADE" }) 
    payments: User;
} 