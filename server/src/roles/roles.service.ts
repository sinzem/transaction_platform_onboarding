import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { UsersService } from 'src/users/users.service';
import { UserRoleDto } from './dto/user-role.dto';

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role,
                                   private usersService: UsersService  ) {}

    async createRole(dto: CreateRoleDto) {
        const roleName = dto.value.toUpperCase();
        const role = await this.roleRepository.create({...dto, value: roleName});
        return role; 
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}});
        return role;
    }

    async addRoleToUser(dto: UserRoleDto) {
        let user = await this.usersService.getUserByEmail(dto.email);
        this.usersService.checkUser(user);
        const role = await this.getRoleByValue(dto.role.toUpperCase());
        this.checkRole(role);
        await user.$add('roles', role.id);
        user = await this.usersService.getUserByEmail(dto.email);
        return user;
    }

    async deleteRoleOfUser(dto: UserRoleDto) {
        let user = await this.usersService.getUserByEmail(dto.email);
        this.usersService.checkUser(user);
        const role = await this.getRoleByValue(dto.role.toUpperCase());
        this.checkRole(role);
        await user.$remove('roles', role.id);
        user = await this.usersService.getUserByEmail(dto.email);
        return user;
    }

    checkRole(role: any) {
        if (!role) {
            throw new HttpException("This role does not exist", HttpStatus.BAD_REQUEST);
        }
    }

}
