import { Injectable, Scope, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Photo } from './photos.model';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable({ scope: Scope.REQUEST })
export class PhotosService {

    constructor(@InjectModel(Photo) private photoRepository: typeof Photo,
                @Inject(REQUEST) private request: Request,
                private jwtService: JwtService,
                private userService: UsersService,
                private fileService: FilesService) {}

    async addPhoto(dto, image: any) {
        let token = this.request.headers.authorization.split(" ")[1];
        const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: process.env.PRIVATE_KEY
            }
          );
        // const fileName = await this.fileService.createFile(image);
        // let user = await this.userService.getUserByEmail(dto.email);
        // const photo = await this.photoRepository.create({image: fileName, userId: user.id});
        // await user.$add("photos", photo.id);
        // user = await this.userService.getUserByEmail(dto.email);
        return payload;
    }

}
