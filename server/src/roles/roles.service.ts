import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Role } from './roles.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { UsersService } from 'src/users/users.service';
import { UserRoleDto } from './dto/user-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role,
                                   private usersService: UsersService,
                                   private authService: AuthService ) {}

    async createRole(dto: CreateRoleDto) {
        const roleName = dto.value.toUpperCase();
        const role = await this.roleRepository.create({...dto, value: roleName});
        return role; 
    }

    async editRole(dto: UpdateRoleDto) {
        const findId = dto.id;
        const role = await this.roleRepository.findOne({where: {id: findId}});
        this.checkRole(role);
        const valueToUpperCase = dto.value.toUpperCase();
        await this.roleRepository.update({...dto, value: valueToUpperCase}, {where: {id: findId}});
        const newRole = await this.roleRepository.findOne({where: {id: findId}});
        return newRole;
    }

    async getAllRoles() {
        const roles = await this.roleRepository.findAll();
        if (!roles) {
            throw new HttpException("No roles found", HttpStatus.NOT_FOUND);
        }
        return roles;
    }

    async getRoleByValue(value: string) {
        value = value.toUpperCase();
        const role = await this.roleRepository.findOne({where: {value}});
        this.checkRole(role);
        return role;
    }

    async getRoleById(id: number) {
        const role = await this.roleRepository.findOne({where: {id}});
        this.checkRole(role);
        return role;
    }

    async deleteRole(id: number) {
        const role = await this.roleRepository.findOne({where: {id}});
        this.checkRole(role);
        await this.roleRepository.destroy({where: {id}});
        return role;
    }
    
    async addRoleToUser(dto: UserRoleDto) {
        let user = await this.usersService.getUserByEmail(dto.email);
        this.usersService.checkUser(user);
        const role = await this.getRoleByValue(dto.role.toUpperCase());
        this.checkRole(role);
        await user.$add("roles", role.id);
        user = await this.usersService.getUserByEmail(dto.email);
        return this.authService.generateToken(user);
    }

    async deleteRoleOfUser(dto: UserRoleDto) {
        let user = await this.usersService.getUserByEmail(dto.email);
        this.usersService.checkUser(user);
        const role = await this.getRoleByValue(dto.role.toUpperCase());
        this.checkRole(role);
        await user.$remove('roles', role.id);
        user = await this.usersService.getUserByEmail(dto.email);
        return this.authService.generateToken(user);
    }

    // async redactionRoleToUser(dto: UserRoleDto, method: string) {
    //     let user = await this.usersService.getUserByEmail(dto.email);
    //     this.usersService.checkUser(user);
    //     const role = await this.getRoleByValue(dto.role.toUpperCase());
    //     this.checkRole(role);
    //     if (method === "add") {
    //         await user.$add('roles', role.id);
    //     }
    //     if (method === "delete") {
            
    //     } 
    //     user = await this.usersService.getUserByEmail(dto.email);
    //     return user;
    // }

    checkRole(role: any) {
        if (!role) {
            throw new HttpException("This role does not exist", HttpStatus.BAD_REQUEST);
        }
    }

}
