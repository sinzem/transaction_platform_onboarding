import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags("Users")
@Controller('api/users')
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

    @Get("/:value")
    getUserByParams(@Param("value") value: string) {
        if (value.includes("email=")) {
            let email = value.replace("email=", "");
            return this.usersService.getUserByEmail(email);
        } else if (value.includes("phone=")) {
            let phone = value.replace("phone=", "");
            return this.usersService.getUserByPhone("+" + phone);
        }
    }

}
