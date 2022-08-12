import "./css/style.css";
import "./css/open-weather-icons.css";

import clearBG from "./imgs/clear.jpg";
import rainBG from "./imgs/rain.jpg";

let container = document.querySelector(".container");

container.class;
let api_key = "b58be16590e00534237546c3de0fc8fd";
let searchBtn = document.querySelector(".submit");
let input = document.querySelector("input");
let tempText = document.querySelector(".temp");
let cityText = document.querySelector(".city");
let timeText = document.querySelector(".time");
let icon = document.querySelector("#mainIcon");
let weatherText = document.querySelector(".weather");
let feelsLikeText = document.querySelector(".feelsLike .value");
let humidityText = document.querySelector(".humidity .value");
let rainText = document.querySelector(".rain .value");
let windText = document.querySelector(".wind .value");

const options = {
  weekday: "long",
  year: "2-digit",
  month: "short",
  day: "numeric",
};

async function getWeatherInfo(city) {
  let response, weather;
  try {
    response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
    );
    weather = await response.json();
    // alert("success");
  } catch (error) {
    alert("API REQUEST FAILED");
  }

  return processWeatherData(weather);
}

async function processWeatherData(weatherData) {
  let city = weatherData.name;
  let country = weatherData.sys.country;
  let temp = weatherData.main.temp;
  let feelsLike = weatherData.main.feels_like;
  let humidity = weatherData.main.humidity;
  let condition = weatherData.weather[0].main;
  let description = weatherData.weather[0].description;
  let windSpeed = weatherData.wind.speed;
  let rain;
  if (weatherData.rain !== undefined) {
    rain = weatherData.rain["1h"];
  } else rain = 0;

  let weatherIcon = weatherData.weather[0].icon;

  let weather = {
    city,
    country,
    condition,
    description,
    temp,
    feelsLike,
    humidity,
    windSpeed,
    rain,
    weatherIcon,
  };

  return weather;
}

searchBtn.addEventListener("click", updateDom);

async function updateDom() {
  let weatherInfo = await getWeatherInfo(input.value);
  let currentTime = new Date();

  input.value = "";
  feelsLikeText.textContent = `${weatherInfo.feelsLike}\u00B0C`;
  humidityText.textContent = `${weatherInfo.humidity}%`;

  rainText.textContent = `${weatherInfo.rain}mm`;
  windText.textContent = `${weatherInfo.windSpeed} m/s`;

  tempText.textContent = `${Math.round(weatherInfo.temp)}\u00B0C`;
  cityText.textContent = `${weatherInfo.city}, ${weatherInfo.country}`;

  timeText.textContent = `${currentTime.toLocaleTimeString("en-us", {
    timeStyle: "short",
  })} - ${currentTime.toLocaleDateString("en-gb", options)}`;

  if (["Rain", "Drizzle", "Thunderstorm"].includes(weatherInfo.condition)) {
    container.style.backgroundImage = `url(${rainBG})`;
  } else {
    container.style.backgroundImage = `url(${clearBG})`;
  }

  icon.className = `owi owi-${weatherInfo.weatherIcon}`;
  weatherText.textContent = weatherInfo.condition;
}

updateDom();
