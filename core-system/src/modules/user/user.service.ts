import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'src/common/utils';
import { TenantService } from '../tenant/tenant.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
    constructor(
        @Inject(UserRepository) private readonly userRepository : UserRepository,
        @Inject(TenantService) private readonly tenantService : TenantService,
        @Inject(RoleService) private readonly roleService : RoleService
    ) {}


    async createUser(
        createUserDto : CreateUserDto
    ) : Promise<any> {
        const [foundedEmail, foundPhone, foundTenant,foundRole] = await Promise.all([
            this.userRepository.checkUserExistByEmail(createUserDto.email),
            this.userRepository.checkUserExistByPhone(createUserDto.phone),
            createUserDto.tenant_id ? this.tenantService.checkTenantExistById(createUserDto.tenant_id) : null,
            this.roleService.checkRoleExistByCode(createUserDto.role)
        ])
        if (foundedEmail){
            throw new BadRequestException('Emall already used')
        }
        if (foundPhone){
            throw new BadRequestException('Phone already used')
        }

        if (!foundTenant && createUserDto.tenant_id){
            throw new BadRequestException('Tenant not found')
        }

        if (!foundRole){
            throw new BadRequestException('Role not found')
        }
        console.log({createUserDto})
        
        createUserDto.role_id = foundRole._id

        createUserDto.password = await hash(createUserDto.password)


        const newUser = await this.userRepository.createUser(createUserDto)

        if (!newUser){
            throw new InternalServerErrorException('Create user failled')
        }
        return newUser
    }

    async getUserById(id : string) : Promise<any> {
        const user = await this.userRepository.getUserById(id)

        if (!user){
            throw new BadRequestException('User not found')
        }
        return user
    }

    async getUserByEmail(email : string) : Promise<any> {
        const user = await this.userRepository.getUserByEmail(email)

        if (!user){
            throw new BadRequestException('User not found')
        }
        return user
    }
}
