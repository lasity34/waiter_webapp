import assert from "assert";
import adminService from "../services/admin_services.js";  // Make sure the path is correct
import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

const connectionOptions = {
  connectionString: process.env.DATABASE_URL_TEST,
  ssl: { rejectUnauthorized: false },
};

const pgp = pgPromise();

const db = pgp(connectionOptions);

describe("Admin Services", function () {
  this.timeout(5000);

  const admin = adminService(db);

  beforeEach(async function () {
    // Truncate the admin table and reset any states if needed
    await db.none("TRUNCATE TABLE your_admins RESTART IDENTITY CASCADE");
    // You can add more setup logic here
  });

  it("should test if admin is fetched by username", async function () {
    await admin.someMethodToInsertAdmin("lyla", "lyla123");  // Assuming you have a method to insert an admin
    const adminData = await admin.getAdminByUsername("lyla");
    assert.strictEqual(adminData.username, "lyla");
  });

  it("should test if password verification works", async function () {
    const isValid = await admin.verifyPassword("lyla123", "lyla123");
    assert.strictEqual(isValid, true);
  });

  it("should test if no admin is returned for invalid username", async function () {
    const adminData = await admin.getAdminByUsername("bjorn");
    assert.strictEqual(adminData, null);
  });

  it("should test if password verification fails for incorrect password", async function () {
    const isValid = await admin.verifyPassword("incorrect_password", "some_hash");
    assert.strictEqual(isValid, false);
  });

  // ... add more tests as needed

  after(function () {
    // Cleanup, close db connection or whatever you need
    db.$pool.end();
  });
});