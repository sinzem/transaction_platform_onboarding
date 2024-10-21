import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { User } from 'src/users/users.model';
import { Photo } from './photos.model';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [PhotosService],
    controllers: [PhotosController],
    imports: [
        SequelizeModule.forFeature([User, Photo]),
        FilesModule,
        AuthModule,
        JwtModule,
        UsersModule,
    ], 
    exports: [
        PhotosService
    ]
        
})
export class PhotosModule {}
