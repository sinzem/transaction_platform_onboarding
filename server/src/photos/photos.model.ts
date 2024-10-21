import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

import { User } from "src/users/users.model";

interface UserPhotoAttrs {
    userId: number;
    image: string;
} 

@Table({tableName: "photos"}) 
export class Photo extends Model<Photo, UserPhotoAttrs> {

    @ApiProperty({example: "1", description: "Unique identifier"}) 
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: "1", description: "Unique user ID"}) 
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ApiProperty({example: "21ui43251.jpg", description: "Photo title"}) 
    @Column({type: DataType.STRING})
    image: string;

    @BelongsTo(() => User, { onDelete: "CASCADE" }) 
    author: User;
} 