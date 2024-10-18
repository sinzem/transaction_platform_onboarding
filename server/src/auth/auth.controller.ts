import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags("Authorization")
@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: "Creating a user"})
    @ApiResponse({status: 201, description: "JWT token(24h)"}) 
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }

    @ApiOperation({summary: "Login"})
    @ApiResponse({status: 201, description: "JWT token(24h)"}) 
    @Post('/login')
    login(@Body() userDto: LoginAuthDto) {
        return this.authService.login(userDto);
    }

}
