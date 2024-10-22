import { Controller, Delete, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PhotosService } from './photos.service';
import { Photo } from './photos.model';
import { User } from 'src/users/users.model';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles-guard';

@ApiTags("User photos")
@Controller("api/photos")
export class PhotosController {

    constructor(private photoService: PhotosService) {}

    @ApiOperation({summary: "Add user photo"}) 
    @ApiResponse({status: 201, type: User})
    @Roles(["USER, WIP-USER, MANAGER, ADMIN"])
    @UseGuards(RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor("image"))
    addPhoto(
             @UploadedFile() image: any) {
        return this.photoService.addPhoto(image)        
    }

    @ApiOperation({summary: "Delete user photo"})
    @ApiResponse({status: 200, type: Photo})
    @Roles(["USER, WIP-USER, MANAGER, ADMIN"])
    @UseGuards(RolesGuard)
    @Delete("/:id")
    deleteUser(@Param("id") id: number) {
        return this.photoService.deletePhoto(id);
    }

}
