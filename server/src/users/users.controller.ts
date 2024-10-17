import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransformRoleDto } from './dto/transform-role.dto';

@ApiTags("Users")
@Controller("api/users")
export class UsersController {

    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: "Creating a user"})
    @ApiResponse({status: 200, type: User}) 
    @Post() 
    create(@Body() userDto: CreateUserDto) { 
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({summary: "Get all users"})
    @ApiResponse({status: 200, type: [User]})
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({summary: "Get user by email"})
    @ApiResponse({status: 200, type: User})
    @Get("/:email")
    getUserByEmail(@Param("email") email: string) {
        return this.usersService.getUserByEmail(email);
    }

    @ApiOperation({summary: "Edit user"})
    @ApiResponse({status: 200, type: User})
    @Put()
    editUser(@Body() userDto: UpdateUserDto) {
        return this.usersService.editUser(userDto);
    }

    @ApiOperation({summary: "Delete account"})
    @ApiResponse({status: 200, type: User})
    @Delete("/:id")
    deleteUser(@Param("id") id: number) {
        return this.usersService.deleteUser(id);
    }

    @ApiOperation({summary: "Add role to user"})
    @ApiResponse({status: 200, type: User}) 
    @Post("/roles") 
    addRoleToUser(@Body() userDto: TransformRoleDto) { 
        return this.usersService.addRoleToUser(userDto);
    }

    @ApiOperation({summary: "Delete role of user"})
    @ApiResponse({status: 200, type: User}) 
    @Patch("/roles") 
    deleteRoleOfUser(@Body() userDto: TransformRoleDto) { 
        return this.usersService.deleteRoleOfUser(userDto);
    }

}
