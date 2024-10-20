import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller("api/photos")
export class PhotosController {

    constructor(private photoService: PhotosService) {}

    @Post()
    @UseInterceptors(FileInterceptor("image"))
    addPhoto(
             @UploadedFile() image: any) {
        return this.photoService.addPhoto(image)        
    }

    // @ApiOperation({summary: "Delete account"})
    // @ApiResponse({status: 200, type: User})
    @Delete("/:id")
    deleteUser(@Param("id") id: number) {
        return this.photoService.deletePhoto(id);
    }

}
