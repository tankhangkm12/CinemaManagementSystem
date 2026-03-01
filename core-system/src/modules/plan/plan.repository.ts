
import { Model } from "mongoose";
import { Plan, PlanDocument } from "./schemas/plan";
import { InjectModel } from "@nestjs/mongoose";
import { CreatePlanDto } from "./dto/create-plan.dto";

export abstract class PlanRepository {
    abstract createPlan(createPlanDto : CreatePlanDto): Promise<any>

    abstract deletePlan(code : string): Promise<any>

    abstract addAverageFeatures(code : string, features : [String]): Promise<any>

    abstract updateMaxBranches(code : string, max_branches : number): Promise<any>

    abstract checkPlanExists(code : string): Promise<any>
}

export class MongoDbPlanRepository extends PlanRepository {
    constructor(
        @InjectModel(Plan.name) private readonly planModel: Model<PlanDocument>
    ) { 
        super()
     }
    async createPlan(createPlanDto : CreatePlanDto): Promise<any> {
        return await this.planModel.create(createPlanDto)
    }

    async deletePlan(code : string): Promise<any> {
        return await this.planModel.findOneAndUpdate(
            {code,is_active : true},
            {is_active : false},
            {new : true}
        )
    }

    async addAverageFeatures(code : string, features : [String]): Promise<any> {
        return await this.planModel.findOneAndUpdate(
            {code,is_active : true},
            {
                $addToSet : {
                    advantage_features : {$each : features}
                }
            },
            {new : true}
        )
    }

    async updateMaxBranches(): Promise<Model<PlanDocument>> {
        throw new Error("Method not implemented.");
    }

    async checkPlanExists(code: string): Promise<any> {
        return await this.planModel.exists({code : code, is_active : true})
    }


}