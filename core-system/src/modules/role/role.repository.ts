import { InjectModel } from "@nestjs/mongoose";
import { Role, RoleDocument } from "../role/schemas/role.schema";
import { Permission, PermissionDocument } from "../role/schemas/permission.schema";
import { Model, Types } from "mongoose";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { CreateRoleDto } from "../role/dto/create-role.dto";

export abstract class RoleRepository {
    abstract createRole(role: CreateRoleDto): Promise<any>
    abstract createPermission(permission: CreatePermissionDto): Promise<any>
    abstract findRoleByCode(code: string): Promise<any>
    abstract resolvePermissionCodes(codes: string[]): Promise<Types.ObjectId[] | null>
    abstract checkPermissionExistByCode(code: string): Promise<boolean>
    abstract checkRoleExistByCode(code: string): Promise<boolean>
    abstract getPermissionsByRoleId(roleId: string): Promise<any>
}

export class MongoDbRoleRepository extends RoleRepository {
    constructor(
        @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
        @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
    ) {
        super();
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<any> {
        return await this.roleModel.create(createRoleDto)
    }

    async createPermission(createPermissionDto: CreatePermissionDto): Promise<any> {
        return await this.permissionModel.create(createPermissionDto)
    }

    async findRoleByCode(code: string): Promise<any> {
        return this.roleModel.findOne({ code , is_active: true}, { _id: 0 }).lean()
    }

    async checkRoleExistByCode(code: string): Promise<any> {
        return this.roleModel
            .findOne({ code, is_active: true })
            .select({ _id: 1, code: 1 })
            .lean();
    }

    async checkPermissionExistByCode(code: string): Promise<boolean> {
        return this.permissionModel.exists({ code, is_active: true }).then(Boolean)
    }

    async resolvePermissionCodes(codes: string[]): Promise<Types.ObjectId[] | null> {
        const found = await this.permissionModel
            .find({ code: { $in: codes }, is_active: true }, { _id: 1 })
            .lean()

        if (found.length !== codes.length) return null

        return found.map(p => p._id)
    }

    async getPermissionsByRoleId(roleId: string): Promise<any> {

        const found = await this.roleModel.findOne({
            _id :  roleId, is_active: true
        }).populate('permissions_ids').lean()

        if (!found) return null


        return found?.permissions_ids
    }
}