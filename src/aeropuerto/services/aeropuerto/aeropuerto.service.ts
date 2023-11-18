import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aeropuerto } from '../../entities/aeropuerto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(Aeropuerto)
    private readonly aeropuertoRepository: Repository<Aeropuerto>,
  ) {}

  async findAll(): Promise<Aeropuerto[]> {
    return await this.aeropuertoRepository.find({
      relations: ['aerolineas'],
    });
  }

  async findOne(id: string): Promise<Aeropuerto> {
    const aeropuerto: Aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id },
      relations: ['aerolineas'],
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aeropuerto'),
        BusinessError.NOT_FOUND,
      );

    return aeropuerto;
  }

  async create(aeropuerto: Aeropuerto): Promise<Aeropuerto> {
    return await this.aeropuertoRepository.save(aeropuerto);
  }

  async update(id: string, aeropuerto: Aeropuerto): Promise<Aeropuerto> {
    const persistedAeropuerto: Aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id },
    });
    if (!persistedAeropuerto)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aeropuerto'),
        BusinessError.NOT_FOUND,
      );

    return await this.aeropuertoRepository.save({
      ...persistedAeropuerto,
      ...aeropuerto,
    });
  }

  async delete(id: string) {
    const aeropuerto: Aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id },
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        NotFoundEntityMessage('aeropuerto'),
        BusinessError.NOT_FOUND,
      );

    return await this.aeropuertoRepository.remove(aeropuerto);
  }
}

