import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransformRoleDto } from './dto/transform-role.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                                   private roleService: RolesService) {}

    async createUser(dto: CreateUserDto) {
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userRepository.create({...dto, password: hashPassword});
        const role = await this.roleService.getRoleByValue("USER"); 
        await user.$set('roles', [role.id]); 
        user.roles = [role]; 
        return user;
    }

    async editUser(dto: UpdateUserDto) {
        const findId = dto.id;
        const user = await this.userRepository.findOne({where: {id: findId}});
        this.checkUser(user);
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const newDto = {...dto, password: hashPassword};
        await this.userRepository.update(newDto, {where: {id: findId}});
        const newUser = await this.userRepository.findOne({where: {id: findId}});
        return newUser;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        if (!users) {
            throw new HttpException("No users found", HttpStatus.BAD_REQUEST);
        }
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        // if (!user) {
        //     throw new HttpException("User with this email was not found", HttpStatus.BAD_REQUEST);
        // }
        return user;
    }
    
    async deleteUser(id: number) {
        const user = await this.userRepository.findOne({where: {id}});
        this.checkUser(user);
        await this.userRepository.destroy({where: {id}});
        return user;
    }

      async addRoleToUser(dto: TransformRoleDto) {
        const roleById = await this.roleService.getRoleByValue(dto.role.toUpperCase()); 
        this.checkRole(roleById);
        let user = await this.getUserByEmail(dto.email);
        this.checkUser(user);
        await user.$add('roles', roleById.id);
        user = await this.getUserByEmail(dto.email);
        return user;
    }

    async deleteRoleOfUser(dto: TransformRoleDto) {
        const roleById = await this.roleService.getRoleByValue(dto.role.toUpperCase()); 
        this.checkRole(roleById);
        let user = await this.getUserByEmail(dto.email);
        this.checkUser(user);
        await user.$remove('roles', roleById.id);
        user = await this.getUserByEmail(dto.email);
        return user;
    }

    private checkRole(role) {
        if (!role) {
            throw new HttpException("This role does not exist", HttpStatus.BAD_REQUEST);
        }
    }

    private checkUser(user) {
        if (!user) {
            throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
        }
    }

    // async getUserByPhone(phone: string) {
    //     const user = await this.userRepository.findOne({where: {phone}, include: {all: true}});
    //     return user;
    // }

}
