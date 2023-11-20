import { Module } from '@nestjs/common';
import { Aeropuerto } from './entities/aeropuerto.entity';
import { AeropuertoService } from './services/aeropuerto/aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoController } from './controllers/aeropuerto/aeropuerto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aeropuerto])],
  providers: [AeropuertoService],
  controllers: [AeropuertoController],
})
export class AeropuertoModule {}
