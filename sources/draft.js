/* (Пример подключения и вставки прямых SQL запросов) */

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import { Sequelize } from 'sequelize-typescript';
// import { User } from './user.entity';

// @Injectable()
// export class UserService {
//   constructor(
//     private readonly sequelize: Sequelize,
//     // @InjectModel(User)
//     // private readonly userModel: typeof User,
//   ) {}

//   async findAll() {
//     const [users] = await this.sequelize.query('SELECT * FROM users;');
//     return users as User[];
//   }
// }
// ---------------------------------------------