import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Aeropuerto } from '../../entities/aeropuerto.entity';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let aeropuertoRepository: Repository<Aeropuerto>;
  let aeropuertoList: Aeropuerto[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile(); 

    service = module.get<AeropuertoService>(AeropuertoService);
    aeropuertoRepository = module.get<Repository<Aeropuerto>>(
      getRepositoryToken(Aeropuerto),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await aeropuertoRepository.clear();

    aeropuertoList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: Aeropuerto = await aeropuertoRepository.save({
        id: faker.string.uuid(),
        nombre: faker.commerce.productAdjective(),
        codigo: faker.datatype.number({ min: 100, max: 999 }).toString(),
        pais: faker.address.country(),
        ciudad: faker.address.city(),
        aerolineas: [],
      });
      aeropuertoList.push(aeropuerto);
    }
  };

  it('findAll should return all aeropuertos', async () => {
    const aeropuertos: Aeropuerto[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertoList.length);
  });

  it('findOne should return a aeropuerto by id', async () => {
    const storedAeropuerto: Aeropuerto = aeropuertoList[0];
    const aeropuerto: Aeropuerto = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre);
  });

  it('findOne should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => {
      return service.findOne('00000000-0000-0000-0000-000000000000');
    }).rejects.toHaveProperty('message', NotFoundEntityMessage('aeropuerto'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new aeropuerto', async () => {
    const aeropuerto: Aeropuerto = {
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      codigo: faker.datatype.number({ min: 100, max: 999 }).toString(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
      aerolineas: [],
    };

    const newAeropuerto: Aeropuerto = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedAeropuerto: Aeropuerto = await aeropuertoRepository.findOne({
      where: { id: newAeropuerto.id },
    });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre);
  });

  it('update should throw an exception for an invalid aeropuerto', async () => {
    let aeropuerto: Aeropuerto = aeropuertoList[0];
    aeropuerto = {
      ...aeropuerto,
      nombre: 'New name',
      aerolineas: [],
    };
    await expect(() =>
      service.update('00000000-0000-0000-0000-000000000000', aeropuerto),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aeropuerto'));
  });

  it('delete should remove a aeropuerto', async () => {
    const aeropuerto: Aeropuerto = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    const deletedAeropuerto: Aeropuerto = await aeropuertoRepository.findOne({
      where: { id: aeropuerto.id },
    });
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete should throw an exception for an invalid aeropuerto', async () => {
    await expect(() =>
      service.delete('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aeropuerto'));
  });
});
