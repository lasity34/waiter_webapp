
import assert from "assert";
import waiterService from "../services/waiter_services.js";  
import adminService from "../services/admin_services.js";
import pgPromise from "pg-promise";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
dotenv.config();

const connectionOptions = {
  connectionString: process.env.DATABASE_URL_TEST,
  ssl: { rejectUnauthorized: false },
};

const pgp = pgPromise();

const db = pgp(connectionOptions);

describe("Waiter Services", function () {
  this.timeout(5000);

  const waiter = waiterService(db);
  const admin = adminService(db)

  beforeEach(async function () {
    // Truncate the waiters and waiters_schedule table and reset any states if needed
    await db.none("TRUNCATE TABLE public.waiters, public.waiters_schedule RESTART IDENTITY CASCADE");
  });

  it("should test if waiter is fetched by username", async function () {
    // Assuming you have a method to insert a waiter
    await admin.createUser("john", "john123");  
    const waiterData = await waiter.getWaiterByUsername("john");
    assert.strictEqual(waiterData.username, "john");
  });

  it("should test if waiter schedule is fetched", async function () {
    // Assuming you have a method to insert a waiter's schedule
    await waiter.insertSchedule("john", "Monday");  
    const schedule = await waiter.getWaiterSchedule("john");
    assert.strictEqual(schedule.day, "Monday");
  });

  it("should test if password verification works", async function () {
    const hash = await bcrypt.hash('myPassword', 10);
    const isValid = await waiter.verifyPassword('myPassword', hash);
    assert.strictEqual(isValid, true);
  });

  it("should test if credentials are verified", async function () {
    await waiter.insertWaiter("john", "john123");
    const isValid = await waiter.verifyCredentials("john", "john123");
    assert.strictEqual(isValid, true);
  });


  it("should test if waiter is created successfully", async function () {
    const result = await waiter.createUser("new_waiter", "new_password");
    assert.strictEqual(result.username, "new_waiter");
  });
});
