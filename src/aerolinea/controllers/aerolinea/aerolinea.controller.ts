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
  import { AerolineaService } from '../../services/aerolinea/aerolinea.service';
  import { BusinessErrorsInterceptor } from '../../../shared/interceptors/interceptors';
  import { AerolineaDto } from '../../dto/aerolinea.dto';
  import { Aerolinea } from '../../entities/aerolinea.entity';
  import { plainToInstance } from 'class-transformer';
  
  @UseInterceptors(BusinessErrorsInterceptor)
  @Controller('aerolineas')
  export class AerolineaController {
      constructor(private readonly aerolineaService: AerolineaService) {}
  
      @Get()
      async findAll() {
          return await this.aerolineaService.findAll();
      }
  
      @Get(':aerolineaId')
      async findOne(@Param('aerolineaId') aerolineaId: string) {
          return await this.aerolineaService.findOne(aerolineaId);
      }
  
      @Post()
      async create(@Body() aerolineaDto: AerolineaDto) {
          const aerolinea: Aerolinea = plainToInstance(Aerolinea, aerolineaDto);
          return await this.aerolineaService.create(aerolinea);
      }
  
      @Put(':aerolineaId')
      async update(
          @Param('aerolineaId') aerolineaId: string,
          @Body() aerolineaDto: AerolineaDto,
      ) {
          const aerolinea: Aerolinea = plainToInstance(Aerolinea, aerolineaDto);
          return await this.aerolineaService.update(aerolineaId, aerolinea);
      }
      @Delete(':aerolineaId')
      @HttpCode(204)
      async delete(@Param('aerolineaId') aerolineaId: string) {
          return await this.aerolineaService.delete(aerolineaId);
      }
  }
    
  
