const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function getStatus() {
  const respond = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  return respond.properties.Status.select.options;
}
function formatDate(string_date) {
  let date = new Date(string_date);
  return date.toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}
async function getTasks() {
  const respond = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  let pages = respond.results.map((page) => {return {...page.properties, icon: page.icon}});
  for (let i = 0; i < pages.length; ++i) {
    if (pages[i].Deadline?.date?.start)
      pages[i].Deadline.date.start = formatDate(pages[i].Deadline.date.start);
    if (pages[i].Deadline?.date?.end)
      pages[i].Deadline.date.end = formatDate(pages[i].Deadline.date.end);
  }
  return pages;
}
async function getCoursesID_Name(){
  const respond = await notion.databases.query({
    database_id: process.env.NOTION_COURSE_ID,
  });
  let obj = {};
  respond.results.forEach(result => {
    obj[result.id] = result.properties.Name.title[0].plain_text;
  });
  return obj;
}

async function createTask({name, course, status, dateStart, dateEnd}){
  const respond = await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Course: {
        relation: [
          {
            id: course,
          },
        ],
      },
      Status: {
        select: {
          name: status,
        },
      },
      Deadline: {
        date: {
          start: dateStart,
          end: dateEnd,
          time_zone: "Asia/Saigon"
        },
      },
    },
  });
}

// (async () => {
  // const respond = await notion.databases.query({
  //   database_id: process.env.NOTION_DATABASE_ID,
  // });
  // console.log(respond.results[0].properties.Course.relation[0].id)
  // getCoursesID_Name();
  // createTask({
  //   name: "Test4",
  //   course: "57a736d2-ab0d-4cb5-aa0f-df416e59651e",
  //   status: "To Do",
  //   dateStart: "2020-12-08T12:00:00Z",
  //   dateEnd: null,
  // })
// })();


module.exports = {
  getStatus,
  getTasks,
  getCoursesID_Name,
  createTask,
};
