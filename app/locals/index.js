const path = require("path");
const fs = require("fs");
const HeaderLink = require("./HeaderLink");

module.exports = {
  ...HeaderLink,
  entrypath: "",
  entrypoints: JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../dist/entrypoints.json"), "utf8")
  ),
  bundle(path) {
    this.ctx.entrypath = path;
  },
  asset(p) {
    return (
      (process.env.NODE_ENV === "development" ? "http://localhost:2233/" : "") +
      p
    );
  },
};
