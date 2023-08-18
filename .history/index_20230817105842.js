import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pgPromise from "pg-promise";

import admin_route from "./routes/admin_route.js";
import home_route from "./routes/home_route.js";
import waiterRoute from "./routes/waiter_route.js";

import adminService from "./services/admin_services.js";
import waiterService from "./services/waiter_services.js";

const app = express();

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

dotenv.config();

const connection = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};


const pgp = pgPromise();

const db = pgp(connection);


const admin_service = adminService(db)



const homeRoute = home_route()
const adminRoute = admin_route(admin_service)



app.get("/", homeRoute.show);
app.post("/admin/login", adminRoute.add)
app.get("/admin/:username", adminRoute.show)
app.post("/admin/create-waiter", adminRoute.createUser);
app.get("/admin/waiters", adminRoute.listWaiters);
app.post("/admin/delete-waiter", adminRoute.deleteUser);



const PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
  console.log("App has started", PORT);
});
