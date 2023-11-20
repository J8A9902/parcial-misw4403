import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertosService } from './aerolinea-aeropuertos.service';
import { Repository } from 'typeorm';
import { Aerolinea } from '../../entities/aerolinea.entity';
import { Aeropuerto } from '../../../aeropuerto/entities/aeropuerto.entity';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

describe('AerolineaAeropuertosService', () => {
  let service: AerolineaAeropuertosService;
  let aerolineasRepository: Repository<Aerolinea>;
  let aeropuertosRepository: Repository<Aeropuerto>;
  let aerolinea: Aerolinea;
  let aeropuertosList: Aeropuerto[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertosService],
    }).compile();

    service = module.get<AerolineaAeropuertosService>(AerolineaAeropuertosService);
    aerolineasRepository = module.get<Repository<Aerolinea>>(
      getRepositoryToken(Aerolinea),
    );
    aeropuertosRepository = module.get<Repository<Aeropuerto>>(
      getRepositoryToken(Aeropuerto),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await aeropuertosRepository.clear();
    await aerolineasRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: Aeropuerto = await aeropuertosRepository.save({
        id: faker.string.uuid(),
        nombre: faker.commerce.productAdjective(),
        codigo: faker.datatype.number({ min: 100, max: 999 }).toString(),
        pais: faker.address.country(),
        ciudad: faker.address.city(),
        aerolineas: [],
      });
      aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineasRepository.save({
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      descripcion: faker.commerce.productDescription(),
      fechaFundacion: faker.datatype.datetime(),
      paginaWeb: faker.internet.url(),
      aeropuertos: aeropuertosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoToAerolinea should add an aeropuerto to a aerolinea', async () => {
    const newAeropuerto: Aeropuerto = await aeropuertosRepository.save({
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      codigo: faker.datatype.number({ min: 100, max: 999 }).toString(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
      aerolineas: [],
    });

    const newAerolinea: Aerolinea = await aerolineasRepository.save({
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      descripcion: faker.commerce.productDescription(),
      fechaFundacion: faker.datatype.datetime(),
      paginaWeb: faker.internet.url(),
    });

    const result: Aerolinea = await service.addAeropuertoToAerolinea(
      newAerolinea.id,
      newAeropuerto.id,
    );

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
  });

  it('addAeropuertoToAerolinea should thrown exception for an invalid aeropuerto', async () => {
    const newAerolinea: Aerolinea = await aerolineasRepository.save({
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      descripcion: faker.commerce.productDescription(),
      fechaFundacion: faker.datatype.datetime(),
      paginaWeb: faker.internet.url(),
    });

    await expect(() =>
      service.addAeropuertoToAerolinea(newAerolinea.id, '0'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aeropuerto'));
  });

  it('addAeropuertoToAerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: Aeropuerto = await aeropuertosRepository.save({
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      codigo: faker.datatype.number({ min: 100, max: 999 }).toString(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
      aerolineas: [],
    });

    await expect(() =>
      service.addAeropuertoToAerolinea('0', newAeropuerto.id),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aerolinea'));
  });

  it('associateAeropuertosToAerolinea should update aeropuertos list for a aerolinea', async () => {
    const newAeropuerto: Aeropuerto = await aeropuertosRepository.save({
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      codigo: faker.datatype.number({ min: 100, max: 999 }).toString(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
      aerolineas: [],
    });

    const updatedAerolinea: Aerolinea = await service.associateAeropuertosToAerolinea(aerolinea.id, [newAeropuerto],);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);
    expect(updatedAerolinea.aeropuertos[0]).not.toBeNull();
    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
  });

  it('associateAeropuertosToAerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: Aeropuerto = await aeropuertosRepository.save({
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      codigo: faker.datatype.number({ min: 100, max: 999 }).toString(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
      aerolineas: [],
    });

    await expect(() =>
      service.associateAeropuertosToAerolinea('0', [newAeropuerto]),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aerolinea'));
  });

  it('associateAeropuertosToAerolinea should throw an exception for an invalid aeropuerto', async () => {
    const newAeropuerto: Aeropuerto = aeropuertosList[0];
    newAeropuerto.id = '0';

    await expect(() =>
      service.associateAeropuertosToAerolinea(aerolinea.id, [newAeropuerto]),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aeropuerto'));
  });

  it('findAeropuertosByAerolineaId should return aeropuertos by aerolinea', async () => {
    const aeropuertos: Aeropuerto[] = await service.findAeropuertosByAerolineaId(aerolinea.id);
    expect(aeropuertos.length).toBe(5);
  });

  it('findAeropuertosByAerolineaId should throw an exception for an invalid aerolinea', async () => {
    await expect(() =>
      service.findAeropuertosByAerolineaId('0'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aerolinea'));
  });

  it('deleteAeropuertoOfAerolinea should remove an aeropuerto from a aerolinea', async () => {
    const aeropuerto: Aeropuerto = aeropuertosList[0];

    await service.deleteAeropuertoFromAerolinea(aerolinea.id, aeropuerto.id);

    const storedAerolinea: Aerolinea = await aerolineasRepository.findOne({
      where: { id: aerolinea.id },
      relations: ['aeropuertos'],
    });
    const deletedAeropuerto: Aeropuerto = storedAerolinea.aeropuertos.find(
      (a) => a.id === aeropuerto.id,
    );

    expect(deletedAeropuerto).toBeUndefined();
  });

  it('deleteAeropuertoOfAerolinea should thrown an exception for an invalid aeropuerto', async () => {
    await expect(() =>
      service.deleteAeropuertoFromAerolinea(aerolinea.id, '0'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aeropuerto'));
  });

  it('deleteAeropuertoOfAerolinea should thrown an exception for an invalid aerolinea', async () => {
    const aeropuerto: Aeropuerto = aeropuertosList[0];
    await expect(() =>
      service.deleteAeropuertoFromAerolinea('0', aeropuerto.id),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('aerolinea'));
  });

  it('deleteAeropuertoOfAerolinea should thrown an exception for an non associated aeropuerto', async () => {
    const newAeropuerto: Aeropuerto = await aeropuertosRepository.save({
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      codigo: faker.datatype.number({ min: 100, max: 999 }).toString(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
      aerolineas: [],
    });

    await expect(() =>
      service.deleteAeropuertoFromAerolinea(aerolinea.id, newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id is not associated to the aerolinea',
    );
  });
});
