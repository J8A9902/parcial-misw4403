import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Aerolinea } from '../../entities/aerolinea.entity';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let aerolineaRepository: Repository<Aerolinea>;
  let aerolineaList: Aerolinea[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile(); 

    service = module.get<AerolineaService>(AerolineaService);
    aerolineaRepository = module.get<Repository<Aerolinea>>(
      getRepositoryToken(Aerolinea),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await aerolineaRepository.clear();

    aerolineaList = [];
    for (let i = 0; i < 5; i++) {
      const aerolinea: Aerolinea = await aerolineaRepository.save({
        id: faker.string.uuid(),
        nombre: faker.commerce.productAdjective(),
        descripcion: faker.commerce.productDescription(),
        fechaFundacion: faker.datatype.datetime(),
        paginaWeb: faker.internet.url(),
        aeropuertos: [],
      });
      aerolineaList.push(aerolinea);
    }
  };

  it('findAll should return all aerolineas', async () => {
    const aerolineas: Aerolinea[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineaList.length);
  });

  it('findOne should return a aerolinea by id', async () => {
    const storedAerolinea: Aerolinea = aerolineaList[0];
    const aerolinea: Aerolinea = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre);
  });

  it('findOne should throw an exception for an invalid aerolinea', async () => {
    await expect(() => {
      return service.findOne('00000000-0000-0000-0000-000000000000');
    }).rejects.toHaveProperty('message', NotFoundEntityMessage('aerolinea'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new aerolinea', async () => {
    const aerolinea: Aerolinea = {
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      descripcion: faker.commerce.productDescription(),
      fechaFundacion: faker.datatype.datetime(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    };

    const newAerolinea: Aerolinea = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: Aerolinea = await aerolineaRepository.findOne({
      where: { id: newAerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre);
  });

  it('update should throw an exception for an invalid aerolinea', async () => {
    let aerolinea: Aerolinea = aerolineaList[0];
    aerolinea = {
      ...aerolinea,
      nombre: 'New name',
      aeropuertos: [],
    };
    await expect(() =>
      service.update('00000000-0000-0000-0000-000000000000', aerolinea),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aerolinea'));
  });

  it('delete should remove a aerolinea', async () => {
    const aerolinea: Aerolinea = aerolineaList[0];
    await service.delete(aerolinea.id);
    const deletedAerolinea: Aerolinea = await aerolineaRepository.findOne({
      where: { id: aerolinea.id },
    });
    expect(deletedAerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid aerolinea', async () => {
    await expect(() =>
      service.delete('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aerolinea'));
  });
});
