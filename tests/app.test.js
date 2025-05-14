const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

describe("API Tests", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Health endpoint çalışıyor mu?", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Server is up and running");
  });
});

describe("POST /api/shorten", () => {
  it("Kısa URL oluşturma", async () => {
    const res = await request(app)
      .post("/api/shorten")
      .send({ url: "https://example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("shortUrl");
  });

  it("Geçersiz URL hatası", async () => {
    const res = await request(app)
      .post("/api/shorten")
      .send({ url: "invalid-url" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid URL");
  });
});
