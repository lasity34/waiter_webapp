import express from "express";
import { engine } from "express-handlebars";
import home_route from "./routes/home_route";

const app = express();


app.engine(
    "handlebars",
    engine({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", "./views");
  app.use(express.static("public"));

  app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json());

app.get("/", )






const PORT = process.env.PORT || 3012;

    app.listen(PORT, function () {
      console.log("App has started", PORT);
    });