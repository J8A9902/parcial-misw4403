import { faker } from '@faker-js/faker';

function getFakeAerolineaEntities(count) {
  const entities = [];

  for (let i = 0; i < count; i++) {
    entities.push({
      id: faker.string.uuid(),
      nombre: faker.commerce.productAdjective(),
      descripcion: faker.commerce.productDescription(),
      fechaFundacion: faker.date(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    });
  }

  return entities;
}
