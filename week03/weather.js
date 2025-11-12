// API key from OpenWeatherMap
const apiKey = "ab4a70c382402fdf8855b80e436ef0b6";

// Dasmariñas, Cavite coordinates
const lat = 14.323767;
const lon = 120.973783;
const units = "metric"; // use "imperial" for Fahrenheit

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon");
const captionDesc = document.querySelector("#weather-desc");

async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // see full JSON in console
      displayResults(data);
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}

function displayResults(data) {
  // Temperature
  currentTemp.innerHTML = `${data.main.temp}&deg;C`;

  // Weather description + icon
  const desc = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  weatherIcon.setAttribute("src", iconSrc);
  weatherIcon.setAttribute("alt", desc);
  captionDesc.textContent = desc;
}

// Run the fetch
apiFetch();
