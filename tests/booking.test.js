import request from "supertest";
import app from "../src/server.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";

let token;
beforeAll(async () => {
  // connect to test DB (set MONGO_URI in .env to a test DB)
  await mongoose.connect(process.env.MONGO_URI);
  // create user and get token
  await User.deleteMany({});
  const res = await request(app).post("/api/auth/register").send({
    name: "Test",
    email: "test@example.com",
    password: "password123"
  });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Booking create and update", () => {
  let id;
  test("POST /api/bookings", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        packageName: "Test Package",
        startDate: "2026-01-01",
        endDate: "2026-01-10",
        guests: 2,
        price: 100
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.booking).toHaveProperty("_id");
    id = res.body.booking._id;
  });

  test("PATCH /api/bookings/:id", async () => {
    const res = await request(app)
      .patch(`/api/bookings/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ guests: 3 });
    expect(res.statusCode).toBe(200);
    expect(res.body.booking.guests).toBe(3);
  });
});
