import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { Role, RoleSchema } from './schemas/role.schema';
import { MongoDbRoleRepository, RoleRepository } from './role.repository';

@Module({
  imports: [
        MongooseModule.forFeature([
      {
        name : Permission.name,
        schema: PermissionSchema
      },
      {
        name : Role.name,
        schema: RoleSchema
      }
    ]),
  ],
  controllers: [
    RoleController
  ],
  providers: [
    RoleService,
    {
      provide: RoleRepository,
      useClass: MongoDbRoleRepository
    }
  ],
  exports: [
    RoleService
  ]
})
export class RoleModule {}
