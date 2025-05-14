const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('API Tests', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Health endpoint çalışıyor mu?', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Server is up and running');
  });
});
