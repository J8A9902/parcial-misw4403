import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors,
  } from '@nestjs/common';
  import { AeropuertoService } from '../../services/aeropuerto/aeropuerto.service';
  import { BusinessErrorsInterceptor } from '../../../shared/interceptors/interceptors';
  import { AeropuertoDto } from '../../dto/aeropuerto.dto';
  import { Aeropuerto } from '../../entities/aeropuerto.entity';
  import { plainToInstance } from 'class-transformer';
  
  @UseInterceptors(BusinessErrorsInterceptor)
  @Controller('aeropuertos')
  export class AeropuertoController {
      constructor(private readonly aeropuertoService: AeropuertoService) {}
  
      @Get()
      async findAll() {
          return await this.aeropuertoService.findAll();
      }
  
      @Get(':aeropuertoId')
      async findOne(@Param('aeropuertoId') aeropuertoId: string) {
          return await this.aeropuertoService.findOne(aeropuertoId);
      }
  
      @Post()
      async create(@Body() aeropuertoDto: AeropuertoDto) {
          const aeropuerto: Aeropuerto = plainToInstance(Aeropuerto, aeropuertoDto);
          return await this.aeropuertoService.create(aeropuerto);
      }
  
      @Put(':aeropuertoId')
      async update(
          @Param('aeropuertoId') aeropuertoId: string,
          @Body() aeropuertoDto: AeropuertoDto,
      ) {
          const aeropuerto: Aeropuerto = plainToInstance(Aeropuerto, aeropuertoDto);
          return await this.aeropuertoService.update(aeropuertoId, aeropuerto);
      }
      @Delete(':aeropuertoId')
      @HttpCode(204)
      async delete(@Param('aeropuertoId') aeropuertoId: string) {
          return await this.aeropuertoService.delete(aeropuertoId);
      }
  }
    
  
