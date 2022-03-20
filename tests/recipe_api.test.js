const supertest = require('supertest');
const app = require('../app');
const { pool } = require('../config');

const api = supertest(app);

test('recipe returned as json', async () => {
  await api
    .get('/api/recipes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('recipe has id, title, ingredients, url, image_url', async () => {
  const response = await api.get('/api/recipes');
  expect(response.body).toHaveLength(10);
  expect(response.body[0].title).toBe('Vanilla Bean Melting Moment Cookies With Caramel Filling');
  expect(response.body[0]).toHaveProperty('recipe_id', 'title', 'ingredients', 'url', 'image_url');
});

afterAll(() => {
  pool.end().then(() => console.log('pool has ended'));
});
