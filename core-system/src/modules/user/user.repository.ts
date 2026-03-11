import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { CreateUserPayload } from "./interfaces/user.payload";

export abstract class UserRepository{
    abstract createUser(createUserPayload : CreateUserPayload): Promise<any>
    abstract getUserById(id : string): Promise<any>
    abstract checkUserExistByEmail(email : string): Promise<any>
    abstract checkUserExistByPhone(phone : string): Promise<any> 
    abstract getUserByEmail(email : string): Promise<any>
}


export class MongoDbUserRepository extends UserRepository{
    constructor(
        @InjectModel(User.name) private readonly userModel : Model<UserDocument>
    ){
        super()
    }

    async createUser(createUserPayload: CreateUserPayload): Promise<any> {
        return await this.userModel.create(createUserPayload)
    }

    async getUserById(id : string): Promise<any> {
        return await this.userModel.findOne({userId : id,is_active : true}).select({
            password : 0,
            is_active : 0,
            _id : 0,
            tenant_id:0,
            __v:0,
            createdAt:0,
            updatedAt:0
        })
    }

    async checkUserExistByEmail(email : string): Promise<any> {
        return await this.userModel.exists({email : email})
    }

    async checkUserExistByPhone(phone: string): Promise<any> {
        return await this.userModel.exists({phone : phone})
    }

    async getUserByEmail(email: string): Promise<any> {
        return await this.userModel.findOne({email : email})
    }
}