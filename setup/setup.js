if (location.href.substring(0, 5) == "http:") {
  location.href = "https://" + location.href.substring(7, location.href.Length);
}

var date = new Date();

var listId;

var records;

function setValue(id, newValue) {
  var element = document.getElementById(id);
  element.value = newValue;
}

function saveRecords(records) {
  window.localStorage.records = JSON.stringify(records);
}

function deleteCookies() {
  (function () {
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  })();
}

function loadValues() {
  records.forEach((record, i) => {
    if (record[4] != listId) return;
    
    document.querySelector("#link" + i).value = record[0];
    document.querySelector("#startTime" + i).value = record[1];
    document.querySelector("#endTime" + i).value = record[2];
  });
}

function orderChange(e, direction) {
  records[parseInt(e.split("order")[1])][3] = 
    records[parseInt(e.split("order")[1])][3] + (direction * 1.5);

  // recalculate orders
  records = records.sort((a, b) => a[3] - b[3]);
  
  let newIndex = 0;
  records = records.map(record => {
    if (record[4] == listId) {
      record[3] = newIndex;
      newIndex++;
    }
    
    return record;
  });

  saveRecords(records);

  onLoad();
}

function linkChange(e) {
  records[parseInt(e.split("link")[1])][0] = document.querySelector(
    "#" + e
  ).value;

  saveRecords(records);
}

function startTimeChange(e) {
  records[parseInt(e.split("startTime")[1])][1] = document.querySelector(
    "#" + e
  ).value;

  saveRecords(records);
}

function endTimeChange(e) {
  records[parseInt(e.split("endTime")[1])][2] = document.querySelector(
    "#" + e
  ).value;

  saveRecords(records);
}

function onLoad() {
  document.querySelector("#holder").innerHTML = "";

  var params = location.search
    .replace(/^\?/, "")
    .split("&")
    .reduce((prev, cur) => {
      var split = cur.split("=");
      prev[split[0]] = split[1];
      return prev;
    }, {});

  if (!params.id)
    return window.open("?id=" + prompt("New List Id: "), "_self");
  
  listId = params.id;

  records = window.localStorage.records
    ? JSON.parse(window.localStorage.records)
    : [];

  var output = "";

  for (var i = 0; i < records.length; i++) {
    if (records[i][4] != listId) continue;
    
    output += `<div id="outer">
        <div class="inner">
          <input class="input" onclick="orderChange(this.id, -1)" id="order${i.toString()}" type="button" value="&#9650;" />
          <input class="input" onclick="orderChange(this.id, 1)" id="order${i.toString()}" type="button" value="&#9660;" />
        </div>
        <div class="inner">
          <input class="input" onchange="linkChange(this.id)" id="link${i.toString()}" type="text" />
        </div>
        <div class="inner">
          <input class="input" onchange="startTimeChange(this.id)" id="startTime${i.toString()}" type="time" />
        </div>
        <div class="inner">
          <input class="input" onchange="endTimeChange(this.id)" id="endTime${i.toString()}" type="time" />
        </div>
      </div>`;
  }

  document.getElementById("holder").innerHTML += output;

  loadValues();
}

function addNew() {
  const lastRecordInList = records.filter(record => record[4] == listId).reverse()[0] || [0,0,0,-1];
  records.push(["", "", "", lastRecordInList[3] + 1, listId]);

  saveRecords(records);

  onLoad();
}

function deleteAll() {
  records = records.filter(record => record[4] != listId);

  saveRecords(records);

  onLoad();
}

function delSlot() {
  let lastSlotIndex = records.findLastIndex((record) => record[4] == listId);
  
  records.splice(lastSlotIndex, 1);

  saveRecords(records);

  onLoad();
}

function copyScript() {
  navigator.clipboard.writeText(`
  (() => {
    var records = ${localStorage.records};

    var dt = new Date();
    
    var listId = '${listId}';

    function isInTimeLimit(startTime, endTime, currentTime) {
      if (currentTime.hour < startTime.hour || currentTime.hour > endTime.hour) {
        return false;
      }
      if (
        startTime.minute > currentTime.minute &&
        currentTime.hour == startTime.hour
      ) {
        return false;
      }
      if (endTime.minute < currentTime.minute && currentTime.hour == endTime.hour) {
        return false;
      }
      return true;
    }

    var linksToOpen = [];

    for (var i = 0; i < records.length; i++) {
      if (records[i][4] != listId) continue;

      var startTime = records[i][1];
      var startTimeObj = {
        hour: startTime.split(":")[0],
        minute: startTime.split(":")[1],
      };
      var endTime = records[i][2];
      var endTimeObj = {
        hour: endTime.split(":")[0],
        minute: endTime.split(":")[1],
      };
      var currentTimeObj = { hour: dt.getHours(), minute: dt.getMinutes() };
      if (isInTimeLimit(startTimeObj, endTimeObj, currentTimeObj)) {
        linksToOpen.push(records[i][0]);
      }
    }

    if (linksToOpen.length == 1) {
      document.location.href = linksToOpen[0];
    } else {
      if (linksToOpen.length > 1) {
        for (var i = 0; i < linksToOpen.length; i++) {
          window.open(linksToOpen[i]);
        }
      }

      window.close();
    }
  })();
  `);
}

function copyUrl() {
  navigator.clipboard.writeText(`https://${location.host}?id=${listId}`)
}

$(document).ready(onLoad);
