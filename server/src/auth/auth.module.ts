import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.PRIVATE_KEY,
            signOptions: {
                expiresIn: '24h'
            }
        }),
        UsersModule,
        RolesModule
    ],
    exports: [
      AuthService,
      JwtModule,
    ]
})
export class AuthModule {}
