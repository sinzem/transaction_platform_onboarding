import * as bcrypt from 'bcrypt';
import * as uuid from "uuid";
import { Request } from 'express';
import { HttpException, HttpStatus, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { LoginAuthDto } from './dto/login-auth.dto';
import { MailService } from 'src/mail/mail.service';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/roles/roles.model';

@Injectable({scope: Scope.REQUEST})
export class AuthService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role,
                @Inject(REQUEST) private request: Request,
                private userService: UsersService,
                private jwtService: JwtService,
                private mailService: MailService) {}

    async login(dto: LoginAuthDto) {
        const user = await this.validateUser(dto);
        user.activation = true;
        await user.save();
        return this.generateToken(user);
    }

    async logout(id: number) {
        const user = await this.userService.getUserById(id);
        this.userService.checkUser(user);
        user.activation = false;
        await user.save();
        return this.generateInactiveToken(user);
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email); 
        if (candidate) {
            throw new HttpException("User with this email exists, try logging in", HttpStatus.BAD_REQUEST)
        }
        const user = await this.userService.createUser(userDto);
        user.activation = true;
        await user.save();
        const token = await this.generateInactiveToken(user);
        const link = `${process.env.API_URL}/confirmation/${token.token}`;
        this.mailService.sendMessage({
            to: user.email,
            from: process.env.MAIL_SENDER,
            subject: "Account activation on " + process.env.API_URL, 
            text: "",
            html:  `
            <div>
                <h1 style="text-align: center">Для активации перейдите по ссылке</h1>
                <a href="${link}" style="display: block; margin: 0 auto; max-width: 600px">${link}</a>
            </div>
            `
        })
        return token;
    }

    async confirmation(link: string) {
        const payload = await this.jwtService.verifyAsync(
            link,
            {secret: process.env.PRIVATE_KEY}
        );
        if (payload) {
            const user = await this.userService.getUserByEmail(payload.email);
            this.userService.checkUser(user);
            const role = await this.roleRepository.findOne({where: {value: "USER"}});
            await user.$set('roles', [role.id]);
            user.roles = [role];
            return user;
        } else {
            throw new UnauthorizedException({message: "Incorrect token"}); 
        }  
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
        const payload = {id: user.id, email: user.email}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    async generateToken(user: User) {
        let rolesValue = [];
        user.roles.forEach(role => rolesValue.push(role.value));
        const payload = {email: user.email, id: user.id, roles: rolesValue, activation: true};
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
