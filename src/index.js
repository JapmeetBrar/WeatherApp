import "./css/style.css";
import "./css/open-weather-icons.css";

import clearBG from "./imgs/clear.jpg";
import rainBG from "./imgs/rain.jpg";

let container = document.querySelector(".container");

let searchBtn = document.querySelector(".submit");
let input = document.querySelector("#cityInput");
let tempText = document.querySelector(".temp");
let cityText = document.querySelector(".city");
let timeText = document.querySelector(".time");
let icon = document.querySelector("#mainIcon");
let weatherText = document.querySelector(".weather");
let feelsLikeText = document.querySelector(".feelsLike .value");
let humidityText = document.querySelector(".humidity .value");
let rainText = document.querySelector(".rain .value");
let windText = document.querySelector(".wind .value");
let checkbox = document.querySelector(".checkbox");

const api_key = "b58be16590e00534237546c3de0fc8fd";
const options = {
  weekday: "long",
  year: "2-digit",
  month: "short",
  day: "numeric",
};

let lastCity = "";

async function getWeatherInfo(city, units) {
  let response, weather;
  try {
    response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=${units}`
    );
    weather = await response.json();
    if (response.ok) {
      input.setCustomValidity("");
      return processWeatherData(weather);
    } else {
      input.setCustomValidity("I AM EXPECTING A CITY");
      input.reportValidity();
    }
  } catch (error) {}
}

async function processWeatherData(weatherData) {
  let city = weatherData.name;
  let country = weatherData.sys.country;
  let temp = weatherData.main.temp;
  let feelsLike = weatherData.main.feels_like;
  let humidity = weatherData.main.humidity;
  let description = weatherData.weather[0].description;
  let windSpeed = weatherData.wind.speed;
  let weatherIcon = weatherData.weather[0].icon;

  let rain = weatherData.rain ? weatherData.rain["1h"] : 0;

  let weather = {
    city,
    country,
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
checkbox.addEventListener("click", () => {
  input.value = "";
  updateDom();
});

async function updateDom() {
  let system = checkbox.checked ? "imperial" : "metric";
  let tempUnit = checkbox.checked ? "F" : "C";
  let speedUnit = checkbox.checked ? "mph" : "m/s";
  let currentTime = new Date();
  let weatherInfo;

  weatherInfo = await getWeatherInfo(
    input.value ? input.value : lastCity,
    system
  );
  input.value = "";

  feelsLikeText.textContent = `${Math.round(
    weatherInfo.feelsLike
  )}\u00B0${tempUnit}`;

  humidityText.textContent = `${weatherInfo.humidity}%`;

  rainText.textContent = `${weatherInfo.rain}mm`;
  windText.textContent = `${weatherInfo.windSpeed} ${speedUnit}`;

  tempText.textContent = `${Math.round(weatherInfo.temp)}\u00B0${tempUnit}`;
  cityText.textContent = `${weatherInfo.city}, ${weatherInfo.country}`;

  timeText.textContent = `${currentTime.toLocaleTimeString("en-us", {
    timeStyle: "short",
  })} - ${currentTime.toLocaleDateString("en-gb", options)}`;

  if (["Rain", "Drizzle", "Thunderstorm"].includes(weatherInfo.condition)) {
    container.style.backgroundImage = `url(${rainBG})`;
  } else {
    container.style.backgroundImage = `url(${clearBG})`;
  }

  lastCity = weatherInfo.city;

  icon.className = `owi owi-${weatherInfo.weatherIcon}`;
  weatherText.textContent = capitalizeEachWord(weatherInfo.description);
}

function capitalizeEachWord(text) {
  let splitText = text.split(" ");
  splitText.forEach((word, i) => {
    splitText[i] = word.charAt(0).toUpperCase() + word.substring(1);
  });
  return splitText.join(" ");
}

updateDom();
