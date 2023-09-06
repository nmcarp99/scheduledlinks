if (location.href.substring(0, 5) == "http:") {
  location.href = "https://" + location.href.substring(7, location.href.Length);
}

var cookieList = document.cookie.split(";");

var records = window.localStorage.records
  ? JSON.parse(window.localStorage.records)
  : [];

var dt = new Date();

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
  for (var i = 0; i < linksToOpen.length; i++) {
    window.open(linksToOpen[i]);
  }
  
  window.close();
}
