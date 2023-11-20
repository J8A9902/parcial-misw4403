import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aerolinea } from '../../entities/aerolinea.entity';
import { Aeropuerto } from '../../../aeropuerto/entities/aeropuerto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

@Injectable()
export class AerolineaAeropuertosService {
  constructor(
    @InjectRepository(Aerolinea)
    private readonly aerolineaRepository: Repository<Aerolinea>,

    @InjectRepository(Aeropuerto)
    private readonly aeropuertoRepository: Repository<Aeropuerto>,
  ) {}

  async addAeropuertoToAerolinea(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<Aerolinea> {
    const aerolinea: Aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });

    if (!aerolinea)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aerolinea'),
        BusinessError.NOT_FOUND,
      );

    const aeropuerto: Aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id: aeropuertoId },
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aeropuerto'),
        BusinessError.NOT_FOUND,
      );

    aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
    return await this.aerolineaRepository.save(aerolinea);
  }

  async associateAeropuertosToAerolinea(
    aerolineaId: string,
    aeropuertos: Aeropuerto[],
  ): Promise<Aerolinea> {
    const aerolinea: Aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });

    if (!aerolinea)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aerolinea'),
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < aeropuertos.length; ++i) {
      const aeropuerto: Aeropuerto = await this.aeropuertoRepository.findOne({
        where: { id: aeropuertos[i].id },
      });
      if (!aeropuerto)
        throw new BusinessLogicException(
          NotFoundEntityMessage('aeropuerto'),
          BusinessError.NOT_FOUND,
        );
    }

    aerolinea.aeropuertos = aeropuertos;
    return await this.aerolineaRepository.save(aerolinea);
  }

  async findAeropuertosByAerolineaId(aerolineaId: string): Promise<Aeropuerto[]> {
    const aerolinea: Aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aerolinea'),
        BusinessError.NOT_FOUND,
      );

    return aerolinea.aeropuertos;
  }

  async deleteAeropuertoFromAerolinea(aerolineaId: string, aeropuertoId: string) {
    const aeropuerto: Aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id: aeropuertoId },
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aeropuerto'),
        BusinessError.NOT_FOUND,
      );

    const aerolinea: Aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });

    if (!aerolinea)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aerolinea'),
        BusinessError.NOT_FOUND,
      );

    const aerolineaAeropuerto: Aeropuerto = aerolinea.aeropuertos.find(
      (e) => e.id === aeropuerto.id,
    );

    if (!aerolineaAeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id is not associated to the aerolinea',
        BusinessError.PRECONDITION_FAILED,
      );

    aerolinea.aeropuertos = aerolinea.aeropuertos.filter((e) => e.id !== aeropuertoId);
    await this.aerolineaRepository.save(aerolinea);
  }
}

