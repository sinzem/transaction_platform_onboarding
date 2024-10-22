import * as fs from "fs";
import * as path from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Photo } from './photos.model';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PhotosService {

    constructor(@InjectModel(Photo) private photoRepository: typeof Photo,
                private userService: UsersService,
                private fileService: FilesService,
                private authService: AuthService) {}

    async addPhoto(image: any) {
        const payload = await this.authService.getPayload();
        const fileName = await this.fileService.createFile(image);
        let user = await this.userService.getUserByEmail(payload.email);
        const photo = await this.photoRepository.create({image: fileName, userId: user.id});
        await user.$add("photos", photo.id);
        user = await this.userService.getUserByEmail(payload.email);
        return user;
    }

    async deletePhoto(id: number) {
        const photo = await this.photoRepository.findOne({where: {id}});
        this.checkPhoto(photo);
        const filePath = path.resolve(__dirname, "..", 'static', photo.image); 
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath);
        }
        await this.photoRepository.destroy({where: {id}});
        return photo;
    }

    async getPhotoByUserId(id: number) {
        const user = await this.userService.getUserById(id);
        this.userService.checkUser(user);
        if (user.photos.length > 0) {
            return user.photos;
        } else {
            throw new HttpException("Sorry, no photo", HttpStatus.BAD_REQUEST);
        }
    }

    checkPhoto(photo: any) {
      if (!photo) {
          throw new HttpException("This photo does not exist", HttpStatus.BAD_REQUEST);
      }
  }

}
