import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Photo } from './photos.model';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import * as fs from "fs";
import * as path from 'path';

@Injectable()
export class PhotosService {

    constructor(@InjectModel(Photo) private photoRepository: typeof Photo,
                // @Inject(forwardRef(() => UsersService))
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
        const filePath = path.resolve(__dirname, "..", 'static'); 
        fs.rmSync(path.join(filePath, photo.image))
        await this.photoRepository.destroy({where: {id}});
        return photo;
    }

    checkPhoto(photo: any) {
      if (!photo) {
          throw new HttpException("This photo does not exist", HttpStatus.BAD_REQUEST);
      }
  }

}
