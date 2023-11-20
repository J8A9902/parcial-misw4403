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
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/interceptors';
import { AerolineaAeropuertosService } from '../../services/aerolinea-aeropuertos/aerolinea-aeropuertos.service';
import { plainToInstance } from 'class-transformer';
import { AeropuertoDto } from '../../../aeropuerto/dto/aeropuerto.dto';
import { Aeropuerto } from '../../../aeropuerto/entities/aeropuerto.entity';
  
@UseInterceptors(BusinessErrorsInterceptor)
@Controller('aerolineas')
export class AerolineaAeropuertosController {
    constructor(
        private readonly aerolineaAeropuertosService: AerolineaAeropuertosService,
    ) {}
    
    @Post(':aerolineaId/aeropuertos/:aeropuertoId')
    // @HttpCode(201)
    async addAeropuertoToAerolinea(
        @Param('aerolineaId') aerolineaId: string,
        @Param('aeropuertoId') aeropuertoId: string,
    ) {
        return await this.aerolineaAeropuertosService.addAeropuertoToAerolinea(
        aerolineaId,
        aeropuertoId,
        );
    }

    @Get(':aerolineaId/aeropuertos')
  async findAeropuertosByAerolineaId(
    @Param('aerolineaId') aerolineaId: string,
  ) {
    return await this.aerolineaAeropuertosService.findAeropuertosByAerolineaId(aerolineaId);
    }

    @Put(':aerolineaId/aeropuertos')
    async associateAeropuertosToAerolinea(
        @Body() aeropuertoDto: AeropuertoDto[],
        @Param('aerolineaId') aerolineaId: string,
    ) {
        const aeropuerto = plainToInstance(Aeropuerto, aeropuertoDto);
        return await this.aerolineaAeropuertosService.associateAeropuertosToAerolinea(
        aerolineaId,
        aeropuerto,
        );
    }

    @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
    @HttpCode(204)
    async deleteAeropuertoFromAerolinea(
        @Param('aerolineaId') aerolineaId: string,
        @Param('aeropuertoId') aeropuertoId: string,
    ) {
        return await this.aerolineaAeropuertosService.deleteAeropuertoFromAerolinea(
        aerolineaId,
        aeropuertoId,
        );
    }
}
