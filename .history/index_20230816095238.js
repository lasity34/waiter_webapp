import express from "express";



const app = express();








const PORT = process.env.PORT || 3012;

    app.listen(PORT, function () {
      console.log("App has started", PORT);
    });