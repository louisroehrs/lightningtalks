
var data = null;

function generateQR(text) {
  const canvas = document.getElementById("qrcodecanvas");
  QRCode.toCanvas(canvas, text, {
    width: 256,
    margin: 2
  }, function (error) {
    if (error) {
      console.error(error);
      alert("Failed to generate QR code");
    }
  });
}

function listTalks(talks) {
  document.getElementById("talks").innerHTML ="";
  talks.map( (talk,i) => {
    if (talks[i].trim().length > 0) {
      const li = document.createElement("li");
      li.innerText = talks[i];
      document.getElementById("talks").append(li);
    }
  })
};

function fetchJSON() {
  fetch("lineup.json")
    .then(response => response.json())
    .then(respdata => {
      data = respdata;
      if (!location.href.includes(data.showpage)) {
        location.href = data.pages[data.showpage];
      }
      console.log(data);
      if ( document.getElementById("hosts")) {
        document.getElementById("hosts").innerText = data.hosts;
      }
      if ( document.getElementById("talks")) {
        listTalks(data.talks);
      }
      if ( document.getElementById("qrcodecanvas")) {
        generateQR(document.getElementById("qrcodetext").getHTML());
      }
    })
    .catch(error => {
      if ( document.getElementById("talks")) {
        document.getElementById("talks").innerText = "Check fetching lineup";
      }
      console.error(error);
    });
}

// fetch JSON initially
fetchJSON();

// reload JSON every 20 seconds
setInterval(fetchJSON, 4000);

function updateTime() {
  if ( !document.getElementById("currentTime")) {
    return;
  }
  
  const eventStart = "19:00";
  const s = eventStart.split(':');
  const startTime = new Date();
  startTime.setHours(s[0]);
  startTime.setMinutes(s[1]);
  
  const now = new Date();
  
  timeLeft = startTime - now;
  
  minutes =  Math.ceil(timeLeft / 1000 / 60);
  
  document.getElementById("currentTime").innerText = minutes  + "minutes";
  document.getElementById("talkdate").innerText = now.toDateString();
  
  if ( minutes > 0) {
    document.getElementById("countdown").innerHTML = " in " + minutes + " minutes <BR>at 7:00pm";
    setTimeout(updateTime,1000);
  } else {
    document.getElementById("countdown").innerHTML = "ing now <BR>";
  }
}

setTimeout(updateTime, 1);
