// scripts/home.js

// MENU TOGGLE
const hamburger = document.getElementById("hamburger");
const menuPanel = document.getElementById("menu-panel");
hamburger.addEventListener("click", () => {
  const open = menuPanel.classList.toggle("open");
  hamburger.textContent = open ? "✖" : "☰";
});

// ==================== WEATHER SECTION ====================
const apiKey = "ab4a70c382402fdf8855b80e436ef0b6";
const lat = 14.323767;
const lon = 120.973783;
const units = "metric";

// Elements
const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon");
const captionDesc = document.querySelector("#weather-desc");

// Container for forecast
let forecastContainer = document.getElementById("forecast-container");
if (!forecastContainer) {
  forecastContainer = document.createElement("div");
  forecastContainer.id = "forecast-container";
  forecastContainer.style.display = "flex";
  forecastContainer.style.justifyContent = "space-around";
  forecastContainer.style.marginTop = "1rem";
  document.querySelector(".weather-grid").appendChild(forecastContainer);
}

async function getWeatherForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather fetch failed");
    const data = await response.json();

    // Current weather
    const current = data.list[0];
    displayCurrentWeather(current);

    // 3-day forecast
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(1, 4);
    displayForecast(daily);

  } catch (error) {
    console.error(error);
    currentTemp.textContent = "Loading...";
    captionDesc.textContent = "Fetching weather data";
  }
}

function displayCurrentWeather(data) {
  const temp = data.main.temp.toFixed(1);
  const desc = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  currentTemp.innerHTML = `${temp}&deg;C`;
  weatherIcon.setAttribute("src", iconSrc);
  weatherIcon.setAttribute("alt", desc);
  captionDesc.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
}

function displayForecast(daily) {
  forecastContainer.innerHTML = "";
  daily.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const temp = day.main.temp.toFixed(1);
    const iconCode = day.weather[0].icon;
    const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const desc = day.weather[0].description;

    const card = document.createElement("div");
    card.style.textAlign = "center";
    card.innerHTML = `
      <p><strong>${dayName}</strong></p>
      <img src="${iconSrc}" alt="${desc}" width="50">
      <p>${temp}&deg;C</p>
      <p style="font-size: 0.8rem;">${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
    `;
    forecastContainer.appendChild(card);
  });
}

getWeatherForecast();


// SPOTLIGHTS SECTION
async function loadSpotlights() {
  try {
    const response = await fetch("data/members.json");
    const data = await response.json();

    // Filter Silver (2) or Gold (3)
    const eligible = data.members.filter(m => m.membershipLevel >= 2);
    const selected = eligible.sort(() => 0.5 - Math.random()).slice(0, 3);

    const container = document.getElementById("spotlight-container");
    container.innerHTML = selected.map(member => `
      <section class="spotlight-card">
        <img src="${member.image}" alt="${member.name} logo" loading="lazy">
        <h3>${member.name}</h3>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <p>${member.info}</p>
        <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
        <p>Membership: ${getMembershipLevel(member.membershipLevel)}</p>
      </section>
    `).join("");

  } catch (error) {
    console.error("Spotlight load error:", error);
  }
}

function getMembershipLevel(level) {
  switch (level) {
    case 1: return "Member";
    case 2: return "Silver";
    case 3: return "Gold";
    default: return "Unknown";
  }
}

loadSpotlights();
