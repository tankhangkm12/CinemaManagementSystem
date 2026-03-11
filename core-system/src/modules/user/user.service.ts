import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'src/common/utils';
import { TenantService } from '../tenant/tenant.service';
import { RoleService } from '../role/role.service';
import { CreateUserResponseDto, GetUserResponseDto } from './dto/create-user.response.dto';
import { CreateUserPayload } from './interfaces/user.payload';

@Injectable()
export class UserService {
    constructor(
        @Inject(UserRepository) private readonly userRepository : UserRepository,
        @Inject(TenantService) private readonly tenantService : TenantService,
        @Inject(RoleService) private readonly roleService : RoleService
    ) {}


    async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    // 1. Check duplicate + resolve role + tenant song song
        const [foundEmail, foundPhone, foundTenant, foundRole] = await Promise.all([
            this.userRepository.checkUserExistByEmail(createUserDto.email),
            this.userRepository.checkUserExistByPhone(createUserDto.phone),
            createUserDto.tenant ? this.tenantService.checkTenantExistById(createUserDto.tenant) : null,
            this.roleService.checkRoleExistByCode(createUserDto.role),
        ]);

        if (foundEmail) throw new ConflictException('Email already used');
        if (foundPhone) throw new ConflictException('Phone already used');
        if (!foundRole) throw new NotFoundException('Role not found');
        if (createUserDto.tenant && !foundTenant) throw new NotFoundException('Tenant not found');

        // 2. Build payload
        const payload: CreateUserPayload = {
            name: createUserDto.name,
            email: createUserDto.email,
            password: await hash(createUserDto.password),
            phone: createUserDto.phone,
            role: {
                role_id: foundRole._id.toString(),
                role_code: foundRole.code,
            },
            tenant: foundTenant ? {
                tenant_id: foundTenant.tenant_id,
                tenant_name: foundTenant.name,
            } : null,
        };

        // 3. Tạo user
        const newUser = await this.userRepository.createUser(payload);

        if (!newUser) throw new InternalServerErrorException('Create user failed');

        // 4. Map response
        return {
            userId: newUser.userId,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            tenant: newUser.tenant ?? null,
            is_active: newUser.is_active,
            createdAt: newUser.createdAt,
        };
    }

    async getUserById(id : string) : Promise<GetUserResponseDto> {
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

        return {
            userId: user.userId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            tenant: user.tenant ?? null
        };
    }

    async getUserForAuth(email : string) : Promise<any> {
        return await this.userRepository.getUserByEmail(email)

    }
}
