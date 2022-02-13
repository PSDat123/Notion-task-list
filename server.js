require("dotenv").config();
const express = require("express");
const notion = require("./notion.js");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("./public"))

let status = [], tasks = [];
notion.getStatus().then(data => status = data);
notion.getTasks().then(data => tasks = data);

setInterval(() => {
  notion.getStatus().then((data) => (status = data));
  notion.getTasks().then((data) => (tasks = data));
}, 1000 * 60 * 15);

app.get("/", (req, res) => {
  res.render('index', {status, tasks});
})

app.listen(process.env.PORT || 5000);