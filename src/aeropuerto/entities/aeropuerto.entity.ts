import { 
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';

import { Aerolinea } from '../../aerolinea/entities/aerolinea.entity';
  
@Entity()
export class Aeropuerto {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    nombre: string;
  
    @Column()
    codigo: string;

    @Column()
    pais: string;

    @Column()
    ciudad: string;
  
    @ManyToMany(() => Aerolinea, (aerolinea) => aerolinea.aeropuertos)
    aerolineas: Aerolinea[];
}
