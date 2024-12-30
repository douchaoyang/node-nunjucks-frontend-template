const express = require("express");
const nunjucks = require("nunjucks");
const app = express();
const routes = require("./routes");
const locals = require("./locals");
const path = require("path");
const port = 3233;

app.set("view engine", "njk");

nunjucks.configure(path.join(__dirname, "../resources/views"), {
  autoescape: true,
  express: app,
});

app.locals = locals;

app.use("/", routes);

app.listen(port, () => {
  console.log(`Nunjucks app listening on port ${port}`);
});
