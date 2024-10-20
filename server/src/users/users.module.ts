import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { Photo } from 'src/photos/photos.model';

@Module({
    providers: [UsersService],
    controllers: [UsersController],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles, Photo]),
    ],
    exports: [
        UsersService
    ]
})
export class UsersModule {}
