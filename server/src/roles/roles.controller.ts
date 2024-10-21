import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
import { User } from 'src/users/users.model';
import { UserRoleDto } from './dto/user-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@ApiTags("Roles")
@Controller('api/roles')
export class RolesController {

    constructor(private roleService: RolesService) {}

    @ApiOperation({summary: "Creating a role"}) 
    @ApiResponse({status: 201, type: Role})
    @Post()
    @UsePipes(ValidationPipe) 
    create(@Body() dto: CreateRoleDto) {  
        return this.roleService.createRole(dto);
    }

    @ApiOperation({summary: "Role editing"}) 
    @ApiResponse({status: 200, type: Role})
    @Put()
    @UsePipes(ValidationPipe) 
    editRole(@Body() dto: UpdateRoleDto) {  
        return this.roleService.editRole(dto);
    }

    @ApiOperation({summary: "Get array of roles"})
    @ApiResponse({status: 200, type: [Role]})
    @Get() 
    getAllRoles() {
        return this.roleService.getAllRoles();
    }
    
    @ApiOperation({summary: "Get role by value"})
    @ApiResponse({status: 200, type: Role})
    @Get('/:value') 
    getByValue(@Param('value') value: string) {
        return this.roleService.getRoleByValue(value);
    }

    @ApiOperation({summary: "Delete role"})
    @ApiResponse({status: 200, type: Role})
    @Delete("/:id")
    deleteRole(@Param("id") id: number) {
        return this.roleService.deleteRole(id);
    }

    @ApiOperation({summary: "Add role to user"}) 
    @ApiResponse({status: 201, type: User})
    @Post("/redaction")
    @UsePipes(ValidationPipe) 
    addRoleToUser(@Body() dto: UserRoleDto) {  
        return this.roleService.addRoleToUser(dto);
    }
    
    @ApiOperation({summary: "Delete role of user"})
    @ApiResponse({status: 200, type: User}) 
    @Patch("/redaction") 
    @UsePipes(ValidationPipe) 
    deleteRoleOfUser(@Body() userDto: UserRoleDto) { 
        return this.roleService.deleteRoleOfUser(userDto);
    }
}
