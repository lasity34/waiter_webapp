
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
  
    await admin.createUser("john", "john123");  
    const waiterData = await waiter.getWaiterByUsername("john");
    assert.strictEqual(waiterData.username, "john");
  });

  it("should test if waiter schedule is fetched", async function () {

    await admin.createUser("john", "john123"); 
    const selectedDays = {
      "Monday": { "morning": "on" }
    };
    await waiter.saveSelectedDays("john", selectedDays);  
    const schedules = await waiter.getWaiterSchedule("john");
    
    assert.strictEqual(schedules[0].day, "Monday");
    assert.strictEqual(schedules[0].time_slot, "morning");
  });
  

  it("should test if password verification works", async function () {
    const hash = await bcrypt.hash('myPassword', 10);
    const isValid = await waiter.verifyPassword('myPassword', hash);
    assert.strictEqual(isValid, true);
  });



  it("should test if credentials are verified", async function () {
    await admin.createUser("john", "john123"); 
    const isValid = await waiter.verifyCredentials("john", "john123");
    assert.strictEqual(isValid, true);
  });


  it("should test if waiter is created successfully", async function () {
    const result = await waiter.createUser("bjorn", "123");
    assert.strictEqual(result.username, "bjorn");
  });
});
