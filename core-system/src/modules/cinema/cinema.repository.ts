import { InjectModel } from "@nestjs/mongoose";
import { Cinema, CinemaDocument } from "./schemas/cinema";
import { Model } from "mongoose";
import { CreateCinemaPayload } from "./interfaces/create-cinema.payload";
import { FindAllCinemaPayload } from "./interfaces/findAll-cinema.payload";
import { UpdateCinemaDto } from "./dto/update-cinema.dto";
import { UpdateCinemaPayload } from "./interfaces/update-cinema.payload";

export abstract class CinemaRepository {
    abstract createCinema(createCinemaPayload: CreateCinemaPayload): Promise<any>
    abstract getCinemaExistBySlug(slug: string): Promise<any>
    abstract findAllCinema(tenantId: string, payload : FindAllCinemaPayload): Promise<any>
    abstract deleteCinema(tenantId: string, cinemaId: string): Promise<any>
    abstract findCinemaById(tenantId: string, cinemaId: string): Promise<any>
    abstract updateCinema(tenantId: string, cinemaId: string, updateCinemaPayload: UpdateCinemaPayload): Promise<any>
}

export class MongoDbCinemaRepository extends CinemaRepository{
    constructor(
        @InjectModel(Cinema.name) private readonly cinemaModel: Model<CinemaDocument>
    ) {
        super()
    }

    async createCinema(createCinemaPayload: CreateCinemaPayload): Promise<any>{
        return await this.cinemaModel.create(createCinemaPayload)
    }

    async getCinemaExistBySlug(slug: string): Promise<any> {
        return await this.cinemaModel.findOne({slug : slug, is_active : true})
            .select({cinema_id : 1, name : 1}).lean()
    }

    async findAllCinema(tenantId: string, payload : FindAllCinemaPayload) : Promise<any> {
        const { status, page = 1, limit = 10 } = payload; 

        const filter: any = { tenant_id: tenantId };
        if (status) filter.status = status;

        const [result] = await this.cinemaModel.aggregate([
            { $match : filter},
            {
                $facet : {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        { $project: { _id: 0, tenant_id: 1, cinema_id: 1, slug: 1, name: 1 } }
                    ],
                    metadata: [
                        { $count: 'total' }
                    ]
                }
            }
        ])

        return {
            data: result.data,
            total: result.data.length,
            page,
            limit,
            totalPages: Math.ceil((result.metadata[0]?.total ?? 0) / limit) 
        };
    }

    async deleteCinema(tenantId: string, cinemaId: string): Promise<any> {
        return await this.cinemaModel
            .findOneAndUpdate({ tenant_id: tenantId, cinema_id: cinemaId }, { deleted: true }, {returnDocument : 'after'})
            .select('tenant_id cinema_id slug name -_id')
            .lean()
    }

    async findCinemaById(tenantId: string, cinemaId: string): Promise<any> {
        return await this.cinemaModel
            .findOne({ tenant_id: tenantId, cinema_id: cinemaId })
            .select('-deleted -deletedAt -__v -images')
            .lean()
    }

    async updateCinema(tenantId: string, cinemaId: string, updateCinemaPayload: UpdateCinemaPayload): Promise<any> {
        return await this.cinemaModel
            .findOneAndUpdate({ tenant_id: tenantId, cinema_id: cinemaId }, {$set : updateCinemaPayload }, {returnDocument : 'after'})
            .select('tenant_id cinema_id slug name -_id')
            .lean()
    }
}