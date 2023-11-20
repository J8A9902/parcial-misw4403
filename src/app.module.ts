import { Module } from '@nestjs/common';
import { Aerolinea } from './aerolinea/entities/aerolinea.entity';
import { Aeropuerto } from './aeropuerto/entities/aeropuerto.entity';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AerolineaModule,
    AeropuertoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial',
      entities: [Aerolinea, Aeropuerto],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
