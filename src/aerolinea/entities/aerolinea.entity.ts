import { 
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';

import { Aeropuerto } from '../../aeropuerto/entities/aeropuerto.entity';
  
@Entity()
export class Aerolinea {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    nombre: string;
  
    @Column()
    descripcion: string;

    @Column()
    fechaFundacion: Date;

    @Column()
    paginaWeb: string;
  
    @ManyToMany(() => Aeropuerto, (aeropuerto) => aeropuerto.aerolineas)
    @JoinTable({
      name: 'aerolineas_aeropuertos',
      joinColumn: {
        name: 'aerolinea_id',
        referencedColumnName: 'id',
      },
      inverseJoinColumn: {
        name: 'aeropuerto_id',
        referencedColumnName: 'id',
      },
    })
    aeropuertos: Aeropuerto[];
}