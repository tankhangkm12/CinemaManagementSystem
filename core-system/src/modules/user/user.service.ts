import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'src/common/utils';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class UserService {
    constructor(
        @Inject(UserRepository) private readonly userRepository : UserRepository,
        @Inject(TenantService) private readonly tenantService : TenantService
    ) {}


    async createUser(
        createUserDto : CreateUserDto | 
        {name : string, email : string, password : string,tenant_id : string, role_id : string,phone : string}
    ) : Promise<any> {
        const [foundedEmail, foundPhone, foundTenant] = await Promise.all([
            this.userRepository.checkUserExistByEmail(createUserDto.email),
            this.userRepository.checkUserExistByPhone(createUserDto.phone),
            createUserDto.tenant_id ? this.tenantService.checkTenantExistById(createUserDto.tenant_id) : null
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

        createUserDto.password = await hash(createUserDto.password)

        return await this.userRepository.createUser(createUserDto)
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
