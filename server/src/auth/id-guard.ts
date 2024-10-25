import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class IdGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
   
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) { 
        throw new UnauthorizedException({message: "User is not authorized"}); 
    }
    const reqId = request.params.id;
    const payload = await this.jwtService.verifyAsync(token, {secret: process.env.PRIVATE_KEY});
    if (!payload) {
        throw new UnauthorizedException({message: "Invalid token"}); 
    }
    if ((reqId == payload.id) || payload.roles.includes("ADMIN")) {
        return true;
    } else {
        return false
    }

  }
}
