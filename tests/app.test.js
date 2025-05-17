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

describe('User API Tests', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('POST /users yeni kullanıcı oluşturmalı', async () => {
    const res = await request(app).post('/users').send({
      name: 'Test Kullanıcı',
      email: 'testuser@example.com',
      userType: 'customer',
      password: '12345678',
      address: 'Test Mahallesi',
      phone: '5551234567',
    });

    expect(res.statusCode).toBe(201); // 201 Created
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
    expect(res.body).toHaveProperty('userType', 'customer');
    expect(res.body).toHaveProperty('name', 'Test Kullanıcı');
  });
});
