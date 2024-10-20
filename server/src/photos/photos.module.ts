import { forwardRef, Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Photo } from './photos.model';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [PhotosService],
    controllers: [PhotosController],
    imports: [
        SequelizeModule.forFeature([User, Photo]),
        UsersModule,
        FilesModule,
        AuthModule,
        JwtModule,
    ], 
    exports: [
        PhotosService
    ]
        
})
export class PhotosModule {}
