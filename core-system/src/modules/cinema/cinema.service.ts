import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CinemaRepository } from './cinema.repository';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { CreateCinemaResponse } from './dto/create-cinema.response.dto';
import { TenantService } from '../tenant/tenant.service';
import { CreateCinemaPayload } from './interfaces/create-cinema.payload';
import { createSlug } from 'src/common/utils';
import { FindAllCinemaPayload } from './interfaces/findAll-cinema.payload';
import {  FindAllCinemaQueryDTO } from './dto/findAll-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { UpdateCinemaResponse } from './dto/update-cinema.response.dto';
import { UpdateCinemaPayload } from './interfaces/update-cinema.payload';

@Injectable()
export class CinemaService {
    constructor(
        @Inject(CinemaRepository) private readonly cinemaRepository: CinemaRepository,

        @Inject(TenantService) private readonly tenantService: TenantService
    ) {}

    private async generateCinemaSlug(name: string,tenant_slug : string): Promise<string> {

        const slug = createSlug(`${tenant_slug}-${name}`);

        const existed = await this.cinemaRepository.getCinemaExistBySlug(slug);

        if (existed) throw new ConflictException('Cinema already exist');

        return slug;
    }


    async createCinema(createCinemaDto: CreateCinemaDto,tenantId: string): Promise<CreateCinemaResponse> {

        const foundTenant = await this.tenantService.checkTenantExistById(tenantId);

        if (!foundTenant) throw new NotFoundException('Tenant not found');

        const cinemaSlug = await this.generateCinemaSlug(createCinemaDto.name,foundTenant.slug);

        const payload : CreateCinemaPayload= {
            tenant_id: foundTenant.tenant_id,
            name: createCinemaDto.name,
            slug: cinemaSlug,
            location: createCinemaDto.location,
            opening_hours: createCinemaDto.opening_hours,
            amenities: createCinemaDto.amenities,
            description: createCinemaDto.description,
            thumbnail: createCinemaDto.thumbnail,
            images: createCinemaDto.images,
            status: createCinemaDto.status,
        };

        const cinema = await this.cinemaRepository.createCinema(payload);
        return {
            cinema_id: cinema.cinema_id,
            name: cinema.name,
            slug: cinema.slug,
            location: cinema.location,
            opening_hours: cinema.opening_hours,
            amenities: cinema.amenities,
            description: cinema.description,
            thumbnail: cinema.thumbnail,
            images: cinema.images,
        }
    }

    async findAllCinema(tenantId: string,findAllCinemaDto : FindAllCinemaQueryDTO) : Promise<any> {
        const payload : FindAllCinemaPayload = { 
            status: findAllCinemaDto.status , 
            page: findAllCinemaDto.page, 
            limit: findAllCinemaDto.limit 
        };
        return await this.cinemaRepository.findAllCinema(tenantId,payload);
    }

    async deleteCinema(tenantId: string,cinemaId : string) : Promise<{"success" : boolean}> {
        const deleted = await this.cinemaRepository.deleteCinema(tenantId,cinemaId);

        if (!deleted) throw new NotFoundException('Cinema not found');

        return {
            "success" : true
        };
    }

    async findCinemaById(tenantId: string,cinemaId : string) : Promise<any> {
        const found = await this.cinemaRepository.findCinemaById(tenantId,cinemaId);

        if (!found) throw new NotFoundException('Cinema not found');

        return found;
    }

    async updateCinema(tenantId: string,cinemaId : string,updateCinemaDto : UpdateCinemaDto) : Promise<UpdateCinemaResponse> {

        if (Object.keys(updateCinemaDto).length === 0) throw new BadRequestException('Phải có ít nhất 1 field để update');

        
        const {name , ...rest} = updateCinemaDto;
        
        const payload : UpdateCinemaPayload = {...rest}

        if (name) {
            payload.name = name;
            const foundTenant = await this.tenantService.checkTenantExistById(tenantId);
            if (!foundTenant) throw new NotFoundException('Tenant not found');
            const cinemaSlug = await this.generateCinemaSlug(name,foundTenant.slug);
            payload.slug = cinemaSlug
        }

        const data = await this.cinemaRepository.updateCinema(tenantId,cinemaId,payload);

        if (!data) throw new NotFoundException('Cinema not found');

        const response : UpdateCinemaResponse = {
            cinema_id: data.cinema_id,
            name: data.name,
            slug: data.slug,
            location: data.location,
            opening_hours: data.opening_hours,
            amenities: data.amenities,
            description: data.description,
            thumbnail: data.thumbnail,
            images: data.images,
        }
        return response
        
    }

}
