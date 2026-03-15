import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { IsPublic } from 'src/common/decorators/auth.metadata';
import { FindAllCinemaQueryDTO } from './dto/findAll-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Controller('api/v1/cinemas')
@IsPublic()
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Post(':tenantId/new')
  async createCinema(@Body() createCinemaDto : CreateCinemaDto,@Param('tenantId') tenantId : string){ 
    return this.cinemaService.createCinema(createCinemaDto, tenantId);
  }


  @Get(':tenantId')
  async findAllCinema(
    @Param('tenantId') tenantId: string,
    @Query() findAllCinemaDto: FindAllCinemaQueryDTO,
  ) {
      return this.cinemaService.findAllCinema(tenantId, findAllCinemaDto);
  }

  @Delete(':tenantId/:cinemaId')
  async deleteCinema(@Param('tenantId') tenantId: string,@Param('cinemaId') cinemaId : string){
    return this.cinemaService.deleteCinema(tenantId,cinemaId);
  }

  @Get(':tenantId/:cinemaId')
  async findCinemaById(@Param('tenantId') tenantId: string,@Param('cinemaId') cinemaId : string){
    return this.cinemaService.findCinemaById(tenantId,cinemaId);
  }

  @Patch(':tenantId/:cinemaId')
  async updateCinema(@Param('tenantId') tenantId: string,@Param('cinemaId') cinemaId : string,@Body() updateCinemaDto : UpdateCinemaDto){
    return this.cinemaService.updateCinema(tenantId,cinemaId,updateCinemaDto);
  }
}
