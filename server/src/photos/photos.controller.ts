import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddPhotoDto } from './dto/photo-add.dto';

@Controller("api/photos")
export class PhotosController {

    constructor(private photoService: PhotosService) {}

    @Post()
    @UseInterceptors(FileInterceptor("image"))
    addPhoto(@Body() dto: AddPhotoDto,
             @UploadedFile() image: any) {
        return this.photoService.addPhoto(dto, image)        
    }

}
