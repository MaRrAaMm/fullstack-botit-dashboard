import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

describe("Products API", () => {
  test("GET /api/products should return products response", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty("currentPage");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("totalProducts");
  });

  test("GET /api/products should respect pagination", async () => {
    const res = await request(app).get("/api/products?page=1&limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.currentPage).toBe(1);
  });

  test("GET /api/products with search query should return status 200", async () => {
    const res = await request(app).get("/api/products?search=test");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
