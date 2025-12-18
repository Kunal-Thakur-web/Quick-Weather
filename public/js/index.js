let clicked = false;
$(".bar").click((e) => {
    e.stopPropagation();
    $(".bar").addClass("clicked");
    clicked = true;
})

$(document).click(() => {
    if(clicked) {
        $(".bar").removeClass("clicked");
        clicked = false;
    }
})

function setWeatherTheme(desc) {

    const body = document.body;
    body.className = "";


    const main = document.querySelector(".main");
    main.className = "main ";


    const sec = document.querySelector(".secondary");
    sec.className = "secondary ";

    const q = document.querySelector(".quick");
    q.className = "quick";


    const w = document.querySelector(".weather");
    w.className = "weather";


    const d = document.querySelector(".dayDesc");
    d.className = "dayDesc";


    desc = desc.toLowerCase();
    if(desc == "thunderstorm") desc = "thunder";

    body.classList.add(`${desc}-bg`);
    main.classList.add(`${desc}-outline`);
    sec.classList.add(`${desc}`);
    q.classList.add(`quick-${desc}`);
    body.classList.add(`weather-${desc}`);
    body.classList.add(`dayDesc-${desc}`);
}

setWeatherTheme(weatherDesc)


function setWeatherIcon(desc, el) {
    desc = desc.toLowerCase();
    el.className = "";
    if(desc == "thunderstorm") desc = "thunder";
    el.classList.add(`${desc}Icon`)
}


setWeatherIcon(weatherDesc, document.querySelector(".infoIcon").children[0]); //info card icon

//hourly icons

setWeatherIcon(hourForecast[0].desc, document.querySelector(".hour1").children[1]);
setWeatherIcon(hourForecast[1].desc, document.querySelector(".hour2").children[1]);
setWeatherIcon(hourForecast[2].desc, document.querySelector(".hour3").children[1]);
setWeatherIcon(hourForecast[3].desc, document.querySelector(".hour4").children[1]);
setWeatherIcon(hourForecast[4].desc, document.querySelector(".hour5").children[1]);


//daily icons
setWeatherIcon(dayForecast[0].desc, document.querySelector(".day1").children[1]);
setWeatherIcon(dayForecast[1].desc, document.querySelector(".day2").children[1]);
setWeatherIcon(dayForecast[2].desc, document.querySelector(".day3").children[1]);
setWeatherIcon(dayForecast[3].desc, document.querySelector(".day4").children[1]);
setWeatherIcon(dayForecast[4].desc, document.querySelector(".day5").children[1]);


const compass = document.querySelector(".wind-compass");

compass.style.setProperty("--angle", `${windDir}deg`);
compass.querySelector(".speed-text").textContent = windSpeed;



function applyAqiClass(index, desc, aqi) {
  if (!index || !desc) return;

  const classes = [
    "aqi-good",
    "aqi-moderate",
    "aqi-poor",
    "aqi-unhealthy",
    "aqi-severe",
    "aqi-hazardous"
  ];

  index.classList.remove(...classes);

  let aqiClass;
  let text;

  if (aqi <= 50) {
    aqiClass = "aqi-good";
    text = "Good";
  } else if (aqi <= 100) {
    aqiClass = "aqi-moderate";
    text = "Moderate";
  } else if (aqi <= 150) {
    aqiClass = "aqi-poor";
    text = "Poor";
  } else if (aqi <= 200) {
    aqiClass = "aqi-unhealthy";
    text = "Unhealthy";
  } else if (aqi <= 300) {
    aqiClass = "aqi-severe";
    text = "Severe";
  } else {
    aqiClass = "aqi-hazardous";
    text = "Hazardous";
  }

  index.classList.add(aqiClass);
  desc.innerHTML = text;
}


applyAqiClass(document.querySelector(".aqiIndCont"),document.querySelector(".aqiDesc"),aqiObj.aqi);
applyAqiClass(document.querySelector(".pm25 .subIndexCont"),document.querySelector(".pm25 .subIndexDesc") ,aqiObj.subIndices.pm25);
applyAqiClass(document.querySelector(".pm10 .subIndexCont"),document.querySelector(".pm10 .subIndexDesc") ,aqiObj.subIndices.pm10);
applyAqiClass(document.querySelector(".o3 .subIndexCont"),document.querySelector(".o3 .subIndexDesc") ,aqiObj.subIndices.o3);
applyAqiClass(document.querySelector(".no2 .subIndexCont"),document.querySelector(".no2 .subIndexDesc") ,aqiObj.subIndices.no2);
applyAqiClass(document.querySelector(".co .subIndexCont"),document.querySelector(".co .subIndexDesc") ,aqiObj.subIndices.co);
applyAqiClass(document.querySelector(".so2 .subIndexCont"),document.querySelector(".so2 .subIndexDesc") ,aqiObj.subIndices.so2);

