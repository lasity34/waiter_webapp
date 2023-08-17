import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";

import admin_route from "./routes/admin_route.js";
import home_route from "./routes/home_route.js";

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


const homeRoute = home_route()
const adminRoute = admin_route()



app.get("/", homeRoute.show);
app.post("/admin/login", adminRoute.add)

const PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
  console.log("App has started", PORT);
});
