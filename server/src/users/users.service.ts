import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PhotosService } from 'src/photos/photos.service';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
               /*  @Inject(forwardRef(() => PhotosService))*/
                /* private photosService: PhotosService */ ) {}

    async createUser(dto: CreateUserDto) {
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userRepository.create({...dto, password: hashPassword});
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
        return user;
    }
    
    async deleteUser(id: number) {
        const user = await this.userRepository.findOne({where: {id}, include: {all: true}});
        this.checkUser(user);
        
        // const filePath = path.resolve(__dirname, "..", 'static'); 
        // let arr = user.photos
        // arr.forEach(photo => {
        //      this.photosService.deletePhoto(photo.id)
        //     fs.rmSync(path.join(filePath, photo.image))
        // })
        await this.userRepository.destroy({where: {id}});
        return user;
    }

    // async deleteRoleOfUser(dto: TransformRoleDto) {
    //     const roleById = await this.roleService.getRoleByValue(dto.role.toUpperCase()); 
    //     this.checkRole(roleById);
    //     let user = await this.getUserByEmail(dto.email);
    //     this.checkUser(user);
    //     await user.$remove('roles', roleById.id);
    //     user = await this.getUserByEmail(dto.email);
    //     return user;
    // }

    checkUser(user: any) {
        if (!user) {
            throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
        }
    }

    // async getUserByPhone(phone: string) {
    //     const user = await this.userRepository.findOne({where: {phone}, include: {all: true}});
    //     return user;
    // }

}
