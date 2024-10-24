import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheKey } from '@nestjs/cache-manager';

import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles-guard';

@ApiTags("Users")
@Controller("api/users")
export class UsersController {

    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: "Creating a user"})
    @ApiResponse({status: 201, type: User}) 
    @Roles(["ADMIN"])
    @UseGuards(RolesGuard)
    @Post() 
    @UsePipes(ValidationPipe)
    create(@Body() userDto: CreateUserDto) { 
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({summary: 'Get all users, add "lim" or "of" to the query parameters to determine quantity or indentation'})
    @ApiResponse({status: 200, description: 'Array of users and their amount(field "total")'})
    // // @Roles(["WIP-USER", "MANAGER", "ADMIN"])
    // // @Roles(["USER"])
    @UseGuards(RolesGuard)
    @CacheKey("users")
    @Get()
    getAll(@Req() req) {
        return this.usersService.getAllUsers(req.query);
    }

    // @ApiOperation({summary: "Get user by email"})
    // @ApiResponse({status: 200, type: User})
    // @Get("/:email")
    // getUserByEmail(@Param("email") email: string) {
    //     return this.usersService.getUserByEmail(email);
    // }

    @ApiOperation({summary: "Get user by id"})
    @ApiResponse({status: 200, type: User})
    @Roles(["USER", "WIP-USER", "MANAGER", "ADMIN"])
    @UseGuards(RolesGuard)
    @Get("/:id")
    getUserById(@Param("id") id: number) {
        return this.usersService.getUserById(id);
    }
    

    @ApiOperation({summary: "Edit user"})
    @ApiResponse({status: 200, type: User})
    // @Roles(["MANAGER", "ADMIN"])
    @UseGuards(RolesGuard)
    @Put()
    @UsePipes(ValidationPipe)
    editUser(@Body() userDto: UpdateUserDto) {
        return this.usersService.editUser(userDto);
    }

    @ApiOperation({summary: "Delete account"})
    @ApiResponse({status: 200, type: User})
    @Roles(["MANAGER", "ADMIN"])
    @UseGuards(RolesGuard)
    @Delete("/:id")
    deleteUser(@Param("id") id: number) {
        return this.usersService.deleteUser(id);
    }

}
