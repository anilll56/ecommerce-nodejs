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

describe('Order API Tests', () => {
  let token;
  let orderId;

  beforeAll(async () => {
    // Kullanıcı kaydı ve giriş işlemleri
    const user = {
      name: 'Test User',
      email: 'test@mail.com',
      password: 'password123',
      userType: 'customer',
    };
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User registered successfully');
    token = res.body.token;
  });
  afterAll(async () => {
    // Test veritabanını temizle
    await mongoose.connection.db.dropDatabase();
  });
  it('Sipariş oluşturma', async () => {
    const orderData = {
      customer_id: 'customerId',
      seller_id: 'sellerId',
      products: [
        { product: 'productId1', quantity: 2 },
        { product: 'productId2', quantity: 1 },
      ],
    };

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(orderData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    orderId = res.body._id;
  });
});
