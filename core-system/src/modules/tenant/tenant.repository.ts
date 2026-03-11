import { Inject } from "@nestjs/common";
import { Tenant, TenantDocument } from "./schemas/tenant";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateTenantPayload } from "./interfaces/tenant.payload";

export abstract class TenantRepository{
    abstract create(createTenantPayload: CreateTenantPayload): Promise<any>
    abstract checkTenantExistBySlug(slug: string): Promise<any>
    abstract checkTenantExistById(id: string): Promise<any>
    abstract getSubscriptionByTenantId(tenantId: string,owner_id: string): Promise<any>
}

export class MongoDbTenantRepository extends TenantRepository{
    constructor(
        @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>
    ){
        super()
    }

    async create(createTenantPayload: CreateTenantPayload): Promise<any>{
        return await this.tenantModel.create(createTenantPayload)
    }

    async checkTenantExistBySlug(slug: string): Promise<any> {
        return await this.tenantModel.exists({slug : slug})
    }

    async checkTenantExistById(id: string): Promise<any> {
        return await this.tenantModel.findOne({tenant_id : id,is_active : true})
            .select({tenant_id : 1,name : 1})
            .lean()
    }

    async getSubscriptionByTenantId(tenantId: string,owner_id: string): Promise<any> {
        return await this.tenantModel.findOne({tenant_id : tenantId, owner_id,is_active : true})
            .select({tenant_id : 1,subscription : 1}).lean()
    }
}