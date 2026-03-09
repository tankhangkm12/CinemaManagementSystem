import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { RegisterUserDto } from "../auth/dto/register-user.dto";

export abstract class UserRepository{
    abstract createUser(createUserDto : CreateUserDto): Promise<any>
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

    async createUser(createUserDto: CreateUserDto): Promise<any> {
        return await this.userModel.create(createUserDto)
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
        return await this.userModel.exists({email : email, is_active : true})
    }

    async checkUserExistByPhone(phone: string): Promise<any> {
        return await this.userModel.exists({phone : phone, is_active : true})
    }

    async getUserByEmail(email: string): Promise<any> {
        return await this.userModel.findOne({email : email, is_active : true})
    }
}