import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from './entities/aerolinea.entity';
import { Aeropuerto } from 'src/aeropuerto/entities/aeropuerto.entity';
import { AerolineaService } from './services/aerolinea/aerolinea.service';


@Module({
    imports: [TypeOrmModule.forFeature([Aeropuerto, Aerolinea])],
    providers: [AerolineaService],
})
export class AerolineaModule {}
