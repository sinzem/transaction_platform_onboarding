import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { PhotosModule } from './photos/photos.module';
import { Photo } from './photos/photos.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';


@Module({
    controllers: [],
    providers: [],
    imports: [
        // ConfigModule.forRoot({
        //     envFilePath: `.${process.env.NODE_ENV}.env` 
        // }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static')
        }),
        SequelizeModule.forRoot({ 
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST, 
          port: Number(process.env.POSTGRESS_PORT), 
          username: process.env.POSTGRES_USER, 
          password: process.env.POSTGRESS_PASSWORD, 
          database: process.env.POSTGRES_DB, 
          models: [User, Role, UserRoles, Photo], 
          autoLoadModels: true 
        }), 
        UsersModule, 
        RolesModule, 
        AuthModule, 
        FilesModule, 
        PhotosModule,
  ]
})
export class AppModule {}

