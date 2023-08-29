import assert from "assert";
import adminService from "../services/admin_services.js";  // Make sure the path is correct
import pgPromise from "pg-promise";
import dotenv from "dotenv";
import bcrypt from 'bcrypt'
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
    await db.none("TRUNCATE TABLE public.admins RESTART IDENTITY CASCADE");
    // You can add more setup logic here
  });

  it("should test if admin is fetched by username", async function () {
    await admin.insertAdmin("bjorn", "bjorn123");  // Assuming you have a method to insert an admin
    const adminData = await admin.getAdminByUsername("bjorn");
    assert.strictEqual(adminData.username, "bjorn");
  });

  it("should test if password verification works", async function () {

    const saltRounds = 10;
    const password = "bjorn123";
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const isValid = await admin.verifyPassword(password, hash);
    assert.strictEqual(isValid, true);
  });

  it("should test if no admin is returned for invalid username", async function () {
    const adminData = await admin.getAdminByUsername("bjorn");
    assert.strictEqual(adminData, null);
  });

  it("should test if password verification fails for incorrect password", async function () {
    const saltRounds = 10;
    const correctPassword = "bjorn123";
    const incorrectPassword = "wrong_password";  // This is the wrong password
    
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(correctPassword, salt);  // Hashing the correct password
    
    const isValid = await admin.verifyPassword(incorrectPassword, hash);  // Using the wrong password for verification
    
    assert.strictEqual(isValid, false);
  });
  

  it("should test if admin password can be updated", async function () {
    const newPassword = "new_password";
    const newHash = bcrypt.hashSync(newPassword, saltRounds);
    
    await db.none("INSERT INTO public.admins (username, password) VALUES ('some_username', 'some_hash')");
    
    // Assuming you have a method like updatePassword in admin_services.js
    await admin.updatePassword('some_username', newHash);
    const updatedAdmin = await admin.getAdminByUsername('some_username');
    
    const isValid = await admin.verifyPassword(newPassword, updatedAdmin.password);
    assert.strictEqual(isValid, true);
  });


  after(function () {
    
    db.$pool.end();
  });
});
