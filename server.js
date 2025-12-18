import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import {mapWeather , forecastSummary , getDayName, timeConvert,calculateAQIFromUGM3Conc} from "./utilities/functions.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const Api_Url = "http://api.weatherapi.com/v1/forecast.json";



app.use(express.static("public"));
app.use(bodyParser.urlencoded({extented: false}));



app.get("/", async (req,res) => {
    // const DayForecast = [
    //     {Day : "Sun",max: "26",min: "10",desc: "Snow"},
    //     {Day : "Mon",max: "26",min: "10",desc: "Cloudy"},
    //     {Day : "Tue",max: "26",min: "10",desc: "ThunderStorm"},
    //     {Day : "Wed",max: "26",min: "10",desc: "Sunny"},
    //     {Day : "Thu",max: "26",min: "10",desc: "Rain"},
    // ];

    // const hourForecast = [
    //     {Time : "10",temp: "21",desc: "Drizzle"},
    //     {Time : "11",temp: "24",desc: "Sunny"},
    //     {Time : "12",temp: "17",desc: "ThunderStorm"},
    //     {Time : "13",temp: "25",desc: "Sunny"},
    //     {Time : "14",temp: "19",desc: "Rain"},
    // ];
    const config = {
        params : {
            "key": API_KEY,
            "q" : "Panipat,India",
            "days": "5",
            "aqi": "yes",
        }
   }

    const resp = await axios.get(Api_Url,config);
    const temp = resp.data.current.temp_c;
    const lat = resp.data.location.lat;
    const lon = resp.data.location.lon;
    const desc = mapWeather(resp.data.current.condition.text);
    const city = resp.data.location.name;
    const con = resp.data.location.country;
    const DayForecast = resp.data.forecast.forecastday.slice(0,5).map(el => ({
        Day: getDayName(el.date),
        max: Math.round(el.day.maxtemp_c),
        min: Math.round(el.day.mintemp_c),
        desc: mapWeather(el.day.condition.text),
    }));
    const today = new Date();
    let hour = today.getHours();
    if(hour > 19) {
        hour = 19;
    }
    const hourForecast = resp.data.forecast.forecastday[0].hour.slice(hour,hour+5).map(el => ({
        Time: timeConvert(el.time.slice(11,13)),
        temp: el.temp_c,
        desc: mapWeather(el.condition.text),
    }));
    const base = resp.data.current.air_quality;
    const aqiObj = calculateAQIFromUGM3Conc({
        pm25: base.pm2_5,
        pm10: base.pm10,
        o3: base.o3,
        co: base.co,
        no2: base.no2,
        so2: base.so2
    });
    const expected = forecastSummary(hourForecast);



    res.render("index.ejs",{
        city,
        con,
        temp,
        lat,
        lon,
        desc,
        DayForecast,
        hourForecast,
        expected,
        aqiObj,
    });
});

app.get("/search",async (req,res) => {
    const config = {
        params : {
            "key": API_KEY,
            "q" : req.query.addr,
            "days": "5",
            "aqi": "yes",
        }
    }

    const resp = await axios.get(Api_Url,config);
    const temp = resp.data.current.temp_c;
    const lat = (resp.data.location.lat).toFixed(2);
    const lon = (resp.data.location.lon).toFixed(2);
    const desc = mapWeather(resp.data.current.condition.text);
    const city = resp.data.location.name;
    const con = resp.data.location.country;
    const windSpeed = resp.data.current.wind_mph;
    const windDir = resp.data.current.wind_degree;
    const DayForecast = resp.data.forecast.forecastday.slice(0,5).map(el => ({
        Day: getDayName(el.date),
        max: Math.round(el.day.maxtemp_c),
        min: Math.round(el.day.mintemp_c),
        desc: mapWeather(el.day.condition.text),
    }));
    const today = new Date();
    let hour = today.getHours();
    if(hour > 19) {
        hour = 19;
    }
    const hourForecast = resp.data.forecast.forecastday[0].hour.slice(hour,hour+5).map(el => ({
        Time: timeConvert(el.time.slice(11,13)),
        temp: el.temp_c,
        desc: mapWeather(el.condition.text),
    }));
    const base = resp.data.current.air_quality;
    const aqiObj = calculateAQIFromUGM3Conc({
        pm25: base.pm2_5,
        pm10: base.pm10,
        o3: base.o3,
        co: base.co,
        no2: base.no2,
        so2: base.so2
    });

    const expected = forecastSummary(hourForecast);

    res.render("index.ejs",{
        city,
        con,
        temp,
        lat,
        lon,
        desc,
        windSpeed,
        windDir,
        DayForecast,
        hourForecast,
        expected,
        aqiObj
    });
}) 



app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})