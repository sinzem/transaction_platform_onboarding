import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
                private roleService: RolesService,
                private jwtService: JwtService) {}

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email); 
        if (candidate) {
            throw new HttpException("User with this email exists", HttpStatus.BAD_REQUEST)
        }
        const user = await this.userService.createUser(userDto);
        const role = await this.roleService.getRoleByValue("USER"); 
        await user.$set('roles', [role.id]);
        user.roles = [role];
        return this.generateToken(user);
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles};
        return {
            token: this.jwtService.sign(payload)
        }
    }
}
