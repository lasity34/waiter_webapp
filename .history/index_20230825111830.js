import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pgPromise from "pg-promise";
import session from "express-session";

import admin_route from "./routes/admin_route.js";
import home_route from "./routes/home_route.js";
import waiter_route from "./routes/waiter_route.js";
import authRoute from "./routes/auth_route.js";
import create_user_route from "./routes/create_user_route.js";
import list_users from "./routes/list_users.js";


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

app.use(session({
  secret: 'my-secret-key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

app.use(bodyParser.urlencoded({ extended: true }));
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
const waiter_service = waiterService(db);


const homeRoute = home_route()
const adminRoute = admin_route(admin_service, waiter_service)
const waiterRoute = waiter_route(waiter_service);
const authRouter = authRoute(admin_service, waiter_service);
const createUserRoute = create_user_route(admin_service)
const listUsers = list_users(admin_service)


// create-waiter
app.post('/admin/create-user', createUserRoute.createUser)
app.get('/admin/create-user',createUserRoute.showCreateUserPage);


app.get('/admin/list-users', listUsers.listWaiters)


app.get("/", homeRoute.show);
app.get("/admin/:username", adminRoute.show)
app.post("/admin/delete-user/:username", adminRoute.deleteUser);


// Waiter-specific routes
app.get("/waiters/:username", waiterRoute.show);
app.post("/waiters/:username", waiterRoute.updateDays);
app.get("/days", waiterRoute.showAvailableDays);


// login
app.post("/login", authRouter.login);

// logout
app.get('/logout', authRouter.logout);



const PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
  console.log("App has started", PORT);
});
