import express from "express";
import { engine } from "express-handlebars";


const app = express();








const PORT = process.env.PORT || 3012;

    app.listen(PORT, function () {
      console.log("App has started", PORT);
    });