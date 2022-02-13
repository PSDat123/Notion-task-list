const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function getStatus() {
  const respond = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  return respond.properties.Status.select.options;
}
async function getRelatedPagesName(ids) {
  let name = [];
  for (let i = 0; i < ids.length; ++i) {
    if(ids[i]){
      const respond = await notion.pages.retrieve({ page_id: ids[i] });
      name.push(respond.properties.Name.title[0].plain_text);
    }
    else name.push(" ");
  }
  return name;
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
  const related_page_name = await getRelatedPagesName(
    pages.map((page) => page.Course?.relation[0]?.id)
  );
  for (let i = 0; i < pages.length; ++i) {
    pages[i].Course = related_page_name[i];
    if (pages[i].Deadline?.date?.start)
      pages[i].Deadline.date.start = formatDate(pages[i].Deadline.date.start);
    if (pages[i].Deadline?.date?.end)
      pages[i].Deadline.date.end = formatDate(pages[i].Deadline.date.end);
  }
  return pages;
}

// (async () => {
//   const respond = await notion.databases.query({
//     database_id: process.env.NOTION_DATABASE_ID,
//   });
  // const respond = await notion.pages.retrieve({page_id: "0fc7adc1-5b7a-48bc-a841-6adf22542815"})
  // let date = new Date(respond.results[2].properties.Deadline.date.start);
  // console.log(
  //   date.toLocaleString("vi-VN", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "numeric",
  //     minute: "numeric",
  //     second: "numeric",
  //   })
  // );
  // console.log(date.toUTCString());
  // console.log(respond.results[2].icon)
// })();
module.exports = {
  getStatus,
  getTasks,
};
