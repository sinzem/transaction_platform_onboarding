import { Body, Controller, Get, Param, Patch, Post, Redirect, Res, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response as res} from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@ApiTags("Authorization")
@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: "Creating a user"})
    @ApiResponse({status: 201, description: "JWT token(24h) and message to the user's email with an activation link"}) 
    @Post('/registration')
    @UsePipes(ValidationPipe)
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }

    @ApiOperation({summary: "Confirmation a user"})
    @ApiResponse({status: 201, description: "JWT token(24h)"}) 
    @Get("/:value")
    confirmation(@Param("value") value: string,
                    @Res() res) {
        this.authService.confirmation(value);
        return res.redirect("http://localhost:7000/api/users");
    }

    @ApiOperation({summary: "Login"})
    @ApiResponse({status: 201, description: "JWT token(24h)"}) 
    @Post('/login')
    @UsePipes(ValidationPipe)
    login(@Body() userDto: LoginAuthDto) {
        return this.authService.login(userDto);
    }

}
