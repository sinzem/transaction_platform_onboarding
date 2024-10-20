/* (модель для создания таблицы users в БД) */
import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Photo } from "src/photos/photos.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

interface UserCreationAttrs {
    name: string;
    surname: string;
    phone: string;
    email: string;
    password: string;
} 

@Table({tableName: "users"}) 
export class User extends Model<User, UserCreationAttrs> {

    @ApiProperty({example: "1", description: "Unique identifier"}) 
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: "Donald", description: "Name"}) 
    @Column({type: DataType.STRING, unique: false, allowNull: false})
    name: string;

    @ApiProperty({example: "Trump", description: "Surname"}) 
    @Column({type: DataType.STRING, unique: false, allowNull: false})
    surname: string;

    @ApiProperty({example: "+380990000000", description: "Phone number"}) 
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    phone: string;

    @ApiProperty({example: "name@gmail.com", description: "Email"}) 
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: "12345678", description: "Password"}) 
    @Column({type: DataType.STRING, allowNull: false})
    password: string;


    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @HasMany(() => Photo, { onDelete: "CASCADE" }) 
    photos: Photo[];
} 