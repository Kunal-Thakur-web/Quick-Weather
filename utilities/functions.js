const sunny = ["sunny","clear"];

const cloudy = ["partlycloudy","cloudy","overcast","mist","fog","freezingfog","haze","smoke","dust","sand","ash","squalls"];

const drizzle = ["patchyrainpossible","patchylightdrizzle","lightdrizzle","freezingdrizzle","heavyfreezingdrizzle"];

const rain = ["patchyrainnearby","lightrain","moderaterain","heavyrain","lightrainshower","moderaterainattimes","heavyrainattimes","torrentialrainshower","patchysleetpossible","lightsleet","moderateorheavysleet","patchyfreezingdrizzlepossible","patchyfreezingrainpossible","freezingrain","icepellets","lightshowersoficepellets","moderateorheavyshowersoficepellets"];

const snow = ["patchysnowpossible","lightsnow","moderatesnow","heavysnow","lightsnowshowers","moderateorheavysnowshowers","patchylightsnow","blowingsnow","blizzard"];

const thunderstorm = ["thunderyoutbreakspossible","patchylightrainwiththunder","moderateorheavyrainwiththunder","patchylightsnowwiththunder","moderateorheavysnowwiththunder"];

function removeSpaces(str) {
  return str.replace(/\s+/g, '');
}



export function mapWeather(desc) {
    desc = desc.toLowerCase();
    desc = removeSpaces(desc);
    if (thunderstorm.includes(desc)) return "Thunderstorm";
    if (snow.includes(desc)) return "Snow";
    if (rain.includes(desc)) return "Rain";
    if (drizzle.includes(desc)) return "Drizzle";
    if (cloudy.includes(desc)) return "Cloudy";
    if (sunny.includes(desc)) return "Sunny";
    return "Cloudy";
}


export function forecastSummary(arr) {
    const current = arr[0].desc;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i].desc !== current) {
            if(arr[i].desc == "Cloudy") {
                return "Clouds are expected ahead";
            }
            else if(arr[i].desc == "Snow") {
                return "Snowfall can happen shortly"
            }
            else if(arr[i].desc == "Sunny") {
                return "Weather expected to clear up"
            }
            return `${arr[i].desc} is expected ahead`;
        }
    }

    if(arr[0].desc == "Rain" || arr[0].desc == "Snow") {
        return `${arr[0].desc}fall is expected to continue`;
    }
    else if(arr[0].desc == "Thunderstorm") {
        return "Thunderstorm would probably go on";
    }
    else if(arr[0].desc == "Sunny") {
        return "Sun will likely keep shining";
    }
    else if(arr[0].desc == "Drizzle") {
        return "Drizzling would likely keep on";
    }
    else {
        return "Clouds not expected to move";
    }
}

export function getDayName(dateStr) {
    return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][ new Date(dateStr).getDay() ];
}

export function timeConvert(t){
    if(t == 0) return "12am";
    if(t < 12) return `${t}am`;
    if(t == 12) return "12pm";
    return `${t-12}pm`;
}


const MW = {
  co: 28.01,
  no2: 46.01,
  so2: 64.07,
  o3: 48.0
};

function ugm3ToPPM(ugm3, mw) {
  return (ugm3 * 24.45) / (mw * 1000);
}

function ugm3ToPPB(ugm3, mw) {
  return ugm3ToPPM(ugm3, mw) * 1000;
}

const AQI_BREAKPOINTS = {
  pm25: [
    [0.0, 12.0, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 350.4, 301, 400],
    [350.5, 500.4, 401, 500]
  ],
  pm10: [
    [0, 54, 0, 50],
    [55, 154, 51, 100],
    [155, 254, 101, 150],
    [255, 354, 151, 200],
    [355, 424, 201, 300],
    [425, 504, 301, 400],
    [505, 604, 401, 500]
  ],
  o3: [
    [0.000, 0.054, 0, 50],
    [0.055, 0.070, 51, 100],
    [0.071, 0.085, 101, 150],
    [0.086, 0.105, 151, 200],
    [0.106, 0.200, 201, 300]
  ],
  co: [
    [0.0, 4.4, 0, 50],
    [4.5, 9.4, 51, 100],
    [9.5, 12.4, 101, 150],
    [12.5, 15.4, 151, 200],
    [15.5, 30.4, 201, 300],
    [30.5, 40.4, 301, 400],
    [40.5, 50.4, 401, 500]
  ],
  no2: [
    [0, 53, 0, 50],
    [54, 100, 51, 100],
    [101, 360, 101, 150],
    [361, 649, 151, 200],
    [650, 1249, 201, 300],
    [1250, 1649, 301, 400],
    [1650, 2049, 401, 500]
  ],
  so2: [
    [0, 35, 0, 50],
    [36, 75, 51, 100],
    [76, 185, 101, 150],
    [186, 304, 151, 200],
    [305, 604, 201, 300],
    [605, 804, 301, 400],
    [805, 1004, 401, 500]
  ]
};

function calcSubIndex(C, bp) {
  for (const [Cl, Ch, Il, Ih] of bp) {
    if (C >= Cl && C <= Ch) {
      return Math.round(
        ((Ih - Il) / (Ch - Cl)) * (C - Cl) + Il
      );
    }
  }
  return null;
}

export function calculateAQIFromUGM3Conc(input) {
  const converted = {
    pm25: input.pm25,
    pm10: input.pm10,
    o3: ugm3ToPPM(input.o3, MW.o3),
    co: ugm3ToPPM(input.co, MW.co),
    no2: ugm3ToPPB(input.no2, MW.no2),
    so2: ugm3ToPPB(input.so2, MW.so2)
  };

  let maxAQI = 0;
  let dominant = null;
  let subIndices = {};

  for (const p in converted) {
    if (!AQI_BREAKPOINTS[p]) continue;

    const aqi = calcSubIndex(converted[p], AQI_BREAKPOINTS[p]);
    if (aqi !== null) {
      subIndices[p] = aqi;
      if (aqi > maxAQI) {
        maxAQI = aqi;
        dominant = p;
      }
    }
  }

  return {
    aqi: maxAQI,
    dominantPollutant: dominant,
    subIndices
  };
}
