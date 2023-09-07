if (location.href.substring(0, 5) == "http:") {
  location.href = "https://" + location.href.substring(7, location.href.Length);
}

var date = new Date();


var records = window.localStorage.records ? JSON.parse(window.localStorage.records) : [];

function setValue(id, newValue) {
  var element = document.getElementById(id);
  element.value = newValue;
}

function deleteCookies() {
  (function() {
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  })();
}

function loadValues() {
  records.forEach((record, i) => {
    document.querySelector("#link" + i).value = record[0];
    document.querySelector("#startTime" + i).value = record[1];
    document.querySelector("#endTime" + i).value = record[2];
    document.querySelector("#order" + i).value = record[3];
  });
}

function orderChange(e) {
  records[parseInt(e.split("order")[1])][3] = parseInt(document.querySelector("#" + e).value);
  
  records = records.sort((a, b) => a[3] - b[3]);
  
  window.localStorage.records = JSON.stringify(records);
  
  onLoad();
}

function linkChange(e) {
  records[parseInt(e.split("link")[1])][0] = document.querySelector("#" + e).value;
  
  window.localStorage.records = JSON.stringify(records);
}

function startTimeChange(e) {
  records[parseInt(e.split("startTime")[1])][1] = document.querySelector("#" + e).value;
  
  window.localStorage.records = JSON.stringify(records);
}

function endTimeChange(e) {
  records[parseInt(e.split("endTime")[1])][2] = document.querySelector("#" + e).value;
  
  window.localStorage.records = JSON.stringify(records);
}

function onLoad() {
  document.querySelector("#holder").innerHTML = "";
  
  var output = "";
  
  for (var i = 0; i < records.length; i++) {
    output +=
      `<div id="outer">
        <div class="inner">
          <input class="input" onchange="orderChange(this.id)" id="order${i.toString()}" type="number" />
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
  records.push([
    "",
    "",
    "",
    0
  ]);
  
  window.localStorage.records = JSON.stringify(records);
  
  onLoad();
}

function deleteAll() {
  records = [];
  
  window.localStorage.records = JSON.stringify(records);
  
  onLoad();
}

function delSlot() {
  records.splice(-1);
  
  window.localStorage.records = JSON.stringify(records);
  
  onLoad();
}

function copyScript() {
  navigator.clipboard.writeText(`
  (() => {
    var records = ${localStorage.records};

    var dt = new Date();

    function isInTimeLimit(startTime, endTime, currentTime) {
      if (currentTime.hour < startTime.hour || currentTime.hour > endTime.hour) {
        return false;
      }
      if (startTime.minute > currentTime.minute && currentTime.hour == startTime.hour) {
        return false;
      }
      if (endTime.minute < currentTime.minute && currentTime.hour == endTime.hour) {
        return false;
      }
      return true;
    }

    var linksToOpen = [];

    for (var i = 0; i < records.length; i++) {
      var startTime = records[i][1];
      var startTimeObj = { hour: startTime.split(":")[0], minute: startTime.split(":")[1] };
      var endTime = records[i][2];
      var endTimeObj = { hour: endTime.split(":")[0], minute: endTime.split(":")[1] };
      var currentTimeObj = { hour: dt.getHours(), minute: dt.getMinutes() };
      if (isInTimeLimit(startTimeObj, endTimeObj, currentTimeObj)) {
        linksToOpen.push(records[i][0]);
      }
    }
    
    if (linksToOpen.length == 1) {
      document.location.href = linksToOpen[0];
    } else {
      for (var i = 0; i < linksToOpen.length; i++) {
        window.open(linksToOpen[i]);
      }

      window.close();
    }
  })();
  `);
}

$(document).ready(onLoad);