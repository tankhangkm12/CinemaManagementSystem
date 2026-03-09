import { Body, Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { IsPublic } from 'src/common/decorators/auth.metadata';

@Controller('api/v1')
@IsPublic()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}


  @Post('permission/new')
  async createPermission(@Body() createPermissionDto : CreatePermissionDto){
    return await this.roleService.createPermission(createPermissionDto)
  }

  @Post('role/new')
  async createRole(@Body() createRoleDto : CreateRoleDto){
    return await this.roleService.createRole(createRoleDto)
  }
}
