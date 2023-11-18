import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aerolinea } from '../../entities/aerolinea.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(Aerolinea)
    private readonly aerolineaRepository: Repository<Aerolinea>,
  ) {}

  async findAll(): Promise<Aerolinea[]> {
    return await this.aerolineaRepository.find({
      relations: ['aeropuertos'],
    });
  }

  async findOne(id: string): Promise<Aerolinea> {
    const aerolinea: Aerolinea = await this.aerolineaRepository.findOne({
      where: { id },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aerolinea'),
        BusinessError.NOT_FOUND,
      );

    return aerolinea;
  }

  async create(aerolinea: Aerolinea): Promise<Aerolinea> {
    return await this.aerolineaRepository.save(aerolinea);
  }

  async update(id: string, aerolinea: Aerolinea): Promise<Aerolinea> {
    const persistedAerolinea: Aerolinea = await this.aerolineaRepository.findOne({
      where: { id },
    });
    if (!persistedAerolinea)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aerolinea'),
        BusinessError.NOT_FOUND,
      );

    return await this.aerolineaRepository.save({
      ...persistedAerolinea,
      ...aerolinea,
    });
  }

  async delete(id: string) {
    const aerolinea: Aerolinea = await this.aerolineaRepository.findOne({
      where: { id },
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aerolinea'),
        BusinessError.NOT_FOUND,
      );

    return await this.aerolineaRepository.remove(aerolinea);
  }
}

