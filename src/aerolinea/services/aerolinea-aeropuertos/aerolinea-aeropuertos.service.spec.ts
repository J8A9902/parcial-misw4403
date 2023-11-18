import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertosService } from './aerolinea-aeropuertos.service';

describe('AerolineaAeropuertosService', () => {
  let service: AerolineaAeropuertosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AerolineaAeropuertosService],
    }).compile();

    service = module.get<AerolineaAeropuertosService>(AerolineaAeropuertosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
