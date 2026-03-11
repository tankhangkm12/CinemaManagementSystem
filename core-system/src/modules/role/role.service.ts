import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoggerService } from 'src/common/logger/logger.service';
import { RoleRepository } from './role.repository';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class RoleService {
    constructor(
        @Inject(LoggerService) private readonly logger : LoggerService,
        @Inject(RoleRepository) private readonly role : RoleRepository
    ) {}



    async checkRoleExistByCode(code : string) : Promise<any> {
        return await this.role.checkRoleExistByCode(code)
    }

    async createPermission(createPermissionDto : CreatePermissionDto) : Promise<any> {
        const code = `${createPermissionDto.resource}:${createPermissionDto.action}`


        if(await this.role.checkPermissionExistByCode(code)) {
            throw new BadRequestException('Permission already exist')
        }

        createPermissionDto.code = code

        const permission = await this.role.createPermission(createPermissionDto)

        return permission
    }

    async createRole(createRoleDto : CreateRoleDto) : Promise<any> {
        const found = await this.role.findRoleByCode(createRoleDto.code)

        if(found) {
            throw new BadRequestException('Role already exist')
        }

        const permissions_ids = await this.role.resolvePermissionCodes(createRoleDto.permissions_codes)
        
        if (!permissions_ids) {
            throw new BadRequestException('Permissions not found')
        }

        createRoleDto.code = createRoleDto.code.toUpperCase()
        
        createRoleDto.permissions_ids = permissions_ids

        const newRole = await this.role.createRole(createRoleDto)

        return newRole
    }

    async getPermissionsByRoleId(roleId : string) : Promise<any> {
        console.log(roleId)

        const permissions_ids = await this.role.getPermissionsByRoleId(roleId)

        if (!permissions_ids) return null

        return permissions_ids?.map( (permission : Permission)  => permission.code)
    }

    

}
