var date = new Date();

function setDefaultCookies() {
  deleteCookies();
  document.cookie = "link0=";
  document.cookie = "startTime0=00:00";
  document.cookie = "endTime0=00:00";
}

function setNewCookies() {
  deleteCookies();
  for (var i = 0; i < cookieList.length; i++) {
    document.cookie = cookieList[i];
  }
}

var cookieList = document.cookie.split(";");

var numTimeSlots = cookieList.length / 3;

if (cookieList.length < 3) {
  setDefaultCookies();
  location.reload();
}

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

var links = [];
var startTimes = [];
var endTimes = [];

// get cookies
for (var i = 0; i < cookieList.length / 3; i++) {
  links.push(cookieList[i * 3]);
  startTimes.push(cookieList[i * 3 + 1]);
  endTimes.push(cookieList[i * 3 + 2]);
}

function loadSettings() {
  for (var i = 0; i < numTimeSlots; i++) {
    document.getElementById('link' + i.toString()).value = links[i].split("=")[1];
    document.getElementById('startTime' + i.toString()).value = startTimes[i].split("=")[1];
    document.getElementById('endTime' + i.toString()).value = endTimes[i].split("=")[1];
  }
}

function linkChange(id) {
  var idNum = parseInt(id.substring(4, id.length));
  cookieList[idNum * 3] = id.toString() + "=" + document.getElementById(id).value.toString();
  setNewCookies();
}

function startTimeChange(id) {
  var idNum = parseInt(id.substring(9, id.length));
  cookieList[idNum * 3 + 1] = id.toString() + "=" + document.getElementById(id).value.toString();
  setNewCookies();
}

function endTimeChange(id) {
  var idNum = parseInt(id.substring(7, id.length));
  cookieList[idNum * 3 + 2] = id.toString() + "=" + document.getElementById(id).value.toString();
  setNewCookies();
}

function onLoad() {
  for (var i = 0; i < numTimeSlots; i++) {
    document.getElementById("holder").innerHTML +=
      "<div id=\"outer\"><div class=\"inner\"><input class=\"input\" onchange=\"linkChange(this.id)\" id=\"link" + i.toString() + "\" type=\"text\" /></div><div class=\"inner\"><input class=\"input\" onchange=\"startTimeChange(this.id)\" id=\"startTime" + i.toString() + "\" type=\"time\" /></div><div class=\"inner\"><input class=\"input\" onchange=\"endTimeChange(this.id)\" id=\"endTime" + i.toString() + "\" type=\"time\" /></div></div>";
  }
  loadSettings();
}

function delSlot() {
  var lastCookie = cookieList[cookieList.length - 1].split("=")[0];
  var newCookieNumber = lastCookie.substring(8, lastCookie.length);
  document.cookie = "link" + newCookieNumber + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "startTime" + newCookieNumber + "=00:00; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "endTime" + newCookieNumber + "=00:00; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  location.reload();
}

function addNew() {
  var lastCookie = cookieList[cookieList.length - 1].split("=")[0];
  var newCookieNumber = (parseInt(lastCookie.substring(8, lastCookie.length)) + 1).toString();
  document.cookie = "link" + newCookieNumber + "=";
  document.cookie = "startTime" + newCookieNumber + "=00:00";
  document.cookie = "endTime" + newCookieNumber + "=00:00";
  location.reload();
}

var red = true;

$(document).ready(()=> onLoad());