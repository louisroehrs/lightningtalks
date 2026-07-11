
var data = null;

function generateQR(text) {
  const canvas = document.getElementById("qrcodecanvas");
  const url = document.getElementById("qrcodetext");
  if (canvas && url) {
    const text = document.getElementById("qrcodetext").getHTML();
    QRCode.toCanvas(canvas, text, {
      width: 256,
      margin: 2
    }, function (error) {
      if (error) {
        console.error(error);
        alert("Failed to generate QR code");
      }
    })
  }
}

function listTalks() {
  if (document.getElementById("talks") ) {
    document.getElementById("talks").innerHTML ="";
    data.talks.map( (talk,i) => {
      if (data.talks[i].trim().length > 0) {
        const li = document.createElement("li");
        li.innerText = data.talks[i];
        document.getElementById("talks").append(li);
      }
    })
  }
};

function listEngagements() {
  if (document.getElementById("engage") ) {
    document.getElementById("engage").innerHTML = "";
    data.engage.map( (method,i) => {
      const p = document.createElement("li");
      p.innerText = data.engage[i];
      document.getElementById("engage").append(p);
    })
  }
};

function listBenefits() {
  if (document.getElementById("benefits") ) {
    document.getElementById("benefits").innerHTML = "";
    data.benefits.map( (method,i) => {
      const p = document.createElement("li");
      p.innerText = data.benefits[i];
      document.getElementById("benefits").append(p);
    })
  }
};

function fetchJSON() {
  fetch("lineup.json")
    .then(response => response.json())
    .then(respdata => {
      data = respdata;
      if (!location.href.includes(data.showpage)) {
        location.href = data.pages[data.showpage].page;
      }
      console.log(data);
      if ( document.getElementById("hosts")) {
        document.getElementById("hosts").innerText = data.hosts;
      }

      listTalks(data.talks);
      listEngagements(data.engage);
      listBenefits(data.benefits);
      
      generateQR();
      
    })
    .catch(error => {
      if ( document.getElementById("talks")) {
        document.getElementById("talks").innerText = "Check fetching lineup";
      }
      console.error(error);
    });
}

// fetch JSON initially
setTimeout(fetchJSON,10);

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

setTimeout(updateTime, 10);
