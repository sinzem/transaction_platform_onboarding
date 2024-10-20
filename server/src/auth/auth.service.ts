import { HttpException, HttpStatus, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { RolesService } from 'src/roles/roles.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({scope: Scope.REQUEST})
export class AuthService {
    constructor(@Inject(REQUEST) private request: Request,
                private userService: UsersService,
                private roleService: RolesService,
                private jwtService: JwtService) {}

    async login(dto: LoginAuthDto) {
        const user = await this.validateUser(dto);
        return this.generateToken(user);
    }

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

    async getPayload() {
        let token = this.request.headers.authorization.split(" ")[1];
        const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: process.env.PRIVATE_KEY
            }
        );
        return payload;
    }

    private async generateToken(user: User) {
        let rolesValue = [];
        user.roles.forEach(role => rolesValue.push(role.value));
        const payload = {email: user.email, id: user.id, roles: rolesValue};
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(dto: LoginAuthDto) {
        const user = await this.userService.getUserByEmail(dto.email); 
        if (!user) {
            throw new UnauthorizedException({message: "Incorrect email address"}); 
        }
        const passwordEquals = await bcrypt.compare(dto.password, user.password); 
        if (!passwordEquals) {
            throw new UnauthorizedException({message: "Incorrect password"}); 
        }

        return user;
    }


}
