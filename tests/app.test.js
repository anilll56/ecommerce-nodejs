const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  } catch (error) {
    console.error('MongoMemoryServer başlatılamadı:', error);
    throw error;
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('API Tests', () => {
  it('Health endpoint çalışıyor mu?', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Server is up and running');
  });
});

// describe('User API Tests', () => {
//   afterEach(async () => {
//     await mongoose.connection.db.collection('users').deleteMany({});
//   });

//   it('POST /users yeni kullanıcı oluşturmalı', async () => {
//     const email = `testuser${Date.now()}@example.com`;
//     const res = await request(app).post('/users').send({
//       name: 'Test Kullanıcı',
//       email,
//       userType: 'customer',
//       password: '12345678',
//       address: 'Test',
//       phone: '5551234567',
//     });

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('_id');
//     expect(res.body).toHaveProperty('email', email);
//     expect(res.body).toHaveProperty('userType', 'customer');
//     expect(res.body).toHaveProperty('name', 'Test Kullanıcı');
//   });
// });
