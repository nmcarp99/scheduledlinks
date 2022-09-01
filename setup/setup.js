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
  });
}

function linkChange(e) {
  records[parseInt(e.split("link")[1])][0] = document.querySelector("#" + e).value;
  
  window.localStorage.records = JSON.stringify(records);
  
  onLoad();
}

function startTimeChange(e) {
  records[parseInt(e.split("startTime")[1])][1] = document.querySelector("#" + e).value;
  
  window.localStorage.records = JSON.stringify(records);
  
  onLoad();
}

function endTimeChange(e) {
  records[parseInt(e.split("endTime")[1])][2] = document.querySelector("#" + e).value;
  
  window.localStorage.records = JSON.stringify(records);
  
  onLoad();
}

function onLoad() {
  document.querySelector("#holder").innerHTML = "";
  
  for (var i = 0; i < records.length; i++) {
    document.getElementById("holder").innerHTML +=
      "<div id=\"outer\"><div class=\"inner\"><input class=\"input\" onchange=\"linkChange(this.id)\" id=\"link" + i.toString() + "\" type=\"text\" /></div><div class=\"inner\"><input class=\"input\" onchange=\"startTimeChange(this.id)\" id=\"startTime" + i.toString() + "\" type=\"time\" /></div><div class=\"inner\"><input class=\"input\" onchange=\"endTimeChange(this.id)\" id=\"endTime" + i.toString() + "\" type=\"time\" /></div></div>";
  }
  
  loadValues();
}

function addNew() {
  records.push([
    "",
    "",
    ""
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

$(document).ready(onLoad);