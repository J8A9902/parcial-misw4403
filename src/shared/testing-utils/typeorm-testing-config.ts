import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from '../../aerolinea/entities/aerolinea.entity';
import { Aeropuerto } from '../../aeropuerto/entities/aeropuerto.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      Aerolinea,
      Aeropuerto
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    Aerolinea,
    Aeropuerto
  ]),
];
