function onLoad() {
  let listsHTML = "";

  let records = JSON.parse(localStorage.records);

  let lists = [];

  records.forEach((record) => {
    if (lists.includes(record[4])) return;

    lists.push(record[4]);
  });

  listsHTML = lists.reduce((prev, cur) => {
    return prev + 
      `<li><a href="/setup?id=${cur}">${cur}</a></li>`;
  }, '<ul>');
  
  listsHTML += '</ul>';

  $("#lists").html(listsHTML);
}

$(document).ready(onLoad);
