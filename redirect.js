var cookieList = document.cookie.split(';');

var links = [];
var startTimes = [];
var endTimes = [];

// get cookies
for (var i = 0; i < cookieList.length / 3; i++) {
  links.push(cookieList[i * 3]);
  startTimes.push(cookieList[i * 3 + 1]);
  endTimes.push(cookieList[i * 3 + 2]);
}

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

for (var i = 0; i < cookieList.length / 3; i++) {
  var startTime = startTimes[i].split("=")[1];
  var startTimeObj = { hour: startTime.split(":")[0], minute: startTime.split(":")[1] };
  var endTime = endTimes[i].split("=")[1];
  var endTimeObj = { hour: endTime.split(":")[0], minute: endTime.split(":")[1] };
  var currentTimeObj = { hour: dt.getHours(), minute: dt.getMinutes() };
  if (isInTimeLimit(startTimeObj, endTimeObj, currentTimeObj)) {
    linksToOpen.push(links[i].split("=")[1]);
  }
}

if (linksToOpen.length == 1) {
  document.location.href = linksToOpen[0];
}
else {
  for (var i = 0; i < linksToOpen.length; i++) {
    if (i == linksToOpen.length - 1) {
      window.open(linksToOpen[i], "_self");
    }
    else {
      window.open(linksToOpen[i]);
    }
  }
}