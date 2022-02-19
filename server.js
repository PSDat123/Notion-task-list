require("dotenv").config();
const express = require("express");
const { redirect } = require("express/lib/response");
const notion = require("./notion.js");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(express.urlencoded({extended: true}));


let status = [], tasks = [], courses = {};
function init(){
  notion.getStatus().then((data) => (status = data));
  notion.getTasks().then((data) => (tasks = data));
  notion.getCoursesID_Name().then((data) => (courses = data));
}
async function init_async() {
  await Promise.all([
    notion.getStatus(),
    notion.getTasks(),
    notion.getCoursesID_Name(),
  ]).then(values => {
    status = values[0];
    tasks = values[1];
    courses = values[2];
  });
}
init();
setInterval(() => {
  init();
}, 1000 * 60 * 15);

app.get("/", (req, res) => {
  res.render('index', {status, tasks, courses});
})
app.get("/sync", async (req, res) => {
  await init_async();
  res.redirect("/");
})
app.post("/create", async (req, res) => {
  const data = req.body;
  let flag1 = false;
  status.forEach(_status => {
    if(_status.name == data.status) flag1 = true;
  })
  if(flag1 && courses.hasOwnProperty(data.courseID) && data.dateStart != ''){
    if (data.title == '') data.title = 'Untitled';
    if (data.dateEnd == '') data.dateEnd = null;
    await notion.createTask({
      name: data.title,
      course: data.courseID,
      status: data.status,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
    });
    await init_async();
  }
  res.redirect("/");
});
app.listen(process.env.PORT || 5000);