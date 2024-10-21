import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { HttpException, HttpStatus, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { RolesService } from 'src/roles/roles.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable({scope: Scope.REQUEST})
export class AuthService {
    constructor(@Inject(REQUEST) private request: Request,
                private userService: UsersService,
                private roleService: RolesService,
                private jwtService: JwtService,
                private mailService: MailService) {}

    async login(dto: LoginAuthDto) {
        const user = await this.validateUser(dto);
        return this.generateToken(user);
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email); 
        if (candidate) {
            throw new HttpException("User with this email exists, try logging in", HttpStatus.BAD_REQUEST)
        }
        const user = await this.userService.createUser(userDto);
        const token = await this.generateInactiveToken(user);
        const link = `${process.env.API_URL}/${token.token}`;
        this.mailService.sendMessage({
            to: user.email,
            from: process.env.MAIL_SENDER,
            subject: "Account activation on " + process.env.API_URL, 
            text: "",
            html:  `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href="${link}">${link}</a>
            </div>
            `
        })
        return token;
    }

    async confirmation(value: string) {
        const payload = await this.jwtService.verifyAsync(
            value,
            {
              secret: process.env.PRIVATE_KEY
            }
        );
        const user = await this.userService.getUserByEmail(payload.email);
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

    private async generateInactiveToken(user: User) {
        const payload = {email: user.email}
        return {
            token: this.jwtService.sign(payload)
        }
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
