import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from './entities/aerolinea.entity';
import { Aeropuerto } from 'src/aeropuerto/entities/aeropuerto.entity';
import { AerolineaService } from './services/aerolinea/aerolinea.service';
import { AerolineaAeropuertosService } from './services/aerolinea-aeropuertos/aerolinea-aeropuertos.service';
import { AerolineaController } from './controllers/aerolinea/aerolinea.controller';
import { AerolineaAeropuertosController } from './controllers/aerolinea-aeropuertos/aerolinea-aeropuertos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aeropuerto, Aerolinea])],
  providers: [AerolineaService, AerolineaAeropuertosService],
  controllers: [AerolineaController, AerolineaAeropuertosController],
})
export class AerolineaModule {}
