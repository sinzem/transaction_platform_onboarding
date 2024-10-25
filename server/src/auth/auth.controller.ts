import { Body, Controller, Get, Param, Post, Req, Res, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@ApiTags("Authorization")
@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: "Creating a user"})
    @ApiResponse({status: 201, description: "Message to the user's email with an activation link and JWT token(24h - Add to Local Storage and add when making requests to Headers in the Authorization field as 'Bearer token')"}) 
    @Post('/registration')
    @UsePipes(ValidationPipe)
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }

    @ApiOperation({summary: "Confirmation a user"})
    @ApiResponse({status: 201, description: "Redirect to main page"}) 
    @Get("/confirmation/:link")
    confirmation(@Req() req ,
                    @Res() res) {
        const link = req.params.link;
        this.authService.confirmation(link);
        return res.redirect(process.env.APP_URL);
    }

    @ApiOperation({summary: "Login"})
    @ApiResponse({status: 201, description: "JWT token(24h - Add to Local Storage and add when making requests to Headers in the Authorization field as 'Bearer token')"}) 
    @Post('/login')
    @UsePipes(ValidationPipe)
    login(@Body() userDto: LoginAuthDto) {
        return this.authService.login(userDto);
    }

    @ApiOperation({summary: "Logout"})
    @ApiResponse({status: 201, description: "JWT token(without roles - access only login or registration, add to Local Storage and add when making requests to Headers in the Authorization field as 'Bearer token')"}) 
    @Get('/logout/:id')
    logout(@Param("id") id: number) {
        return this.authService.logout(id);
    }

}
