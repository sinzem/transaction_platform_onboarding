import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { Roles } from './roles-auth.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService,
                private usersService: UsersService,
                private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    if (!requiredRoles) {
        return true;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) { 
        throw new UnauthorizedException({message: "User is not authorized"}); 
    }
    
    let user;
    try {
        user = await this.jwtService.verifyAsync(token, {secret: process.env.PRIVATE_KEY});
    } catch (e) {
        throw new UnauthorizedException({message: "Invalid token"});
    }

    const checkUser = await this.usersService.getUserByEmail(user.email);
    this.usersService.checkUser(checkUser);
    if (!user.activation) {
        if (checkUser.activation === false) {
            throw new UnauthorizedException({message: "User is not authorized"});
        }
    }
    if (user.activation === false) {
        throw new UnauthorizedException({message: "User is not authorized"});
    }
    if (!user.roles) {
        if (checkUser.roles.length > 0) {
            const roles = [];
            checkUser.roles.forEach(role => roles.push(role.value));
            request.roles = roles;
        } else {
            throw new UnauthorizedException({message: "User is not authorized"});
        }
    } else {
        request.roles = user.roles;
    }
    
    return request.roles.some(role => requiredRoles.includes(role));
  }
}
