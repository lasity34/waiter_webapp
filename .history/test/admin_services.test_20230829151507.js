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

const saltRounds = 10;

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
    const incorrectPassword = "wrong_password"; 
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(correctPassword, salt);  
    
    const isValid = await admin.verifyPassword(incorrectPassword, hash);
    
    assert.strictEqual(isValid, false);
  });
  

  it("should test if admin password can be updated", async function () {
    const newPassword = "bjorn1989";
    const newHash = bcrypt.hashSync(newPassword, saltRounds);
    
    // Insert a new admin into the database
    await db.none("INSERT INTO public.admins (username, password) VALUES ('bjorn', 'some_hash')");
    
    // Debugging Line: Check the admin before the update
    const beforeUpdate = await admin.getAdminByUsername('bjorn');
    console.log("Before Update: ", beforeUpdate);
    
    // Update the password using the new function
    await admin.updatePassword('bjorn', newHash);
    
    // Debugging Line: Check the admin after the update
    const afterUpdate = await admin.getAdminByUsername('bjorn');
    console.log("After Update: ", afterUpdate);
    
    const isValid = await admin.verifyPassword(newPassword, afterUpdate.password);
    assert.strictEqual(isValid, true);
  });
  

  it("should test if admin can be deleted", async function () {
    // Insert a new admin into the database
    await db.none("INSERT INTO public.admins (username, password) VALUES ('some_username', 'some_hash')");
    
    // Delete the admin using the new function
    await admin.deleteAdmin('some_username');
    const deletedAdmin = await admin.getAdminByUsername('some_username');
    
    assert.strictEqual(deletedAdmin, null);
  });

  it("should test for a nonexistent admin", async function () {
    const nonexistentAdmin = await admin.getAdminByUsername('nonexistent_username');
    assert.strictEqual(nonexistentAdmin, null);
  });


  after(function () {
    
    db.$pool.end();
  });
});
