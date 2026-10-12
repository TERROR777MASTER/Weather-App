/*
  SKYCAST WEATHER — college project
  1) Open RapidAPI and choose your OpenWeather API listing.
  2) Copy the exact endpoint URL, RapidAPI host and key from its Code Snippets.
  3) Paste them into the constants below.
  Note: A key in front-end JavaScript is visible to anyone using the site.
  For a public deployment, keep the key on a server/backend instead.
*/

const RAPIDAPI_KEY = '461c39a9c6msh3d8ce7747b7da2fp145affjsn0cda7d996894';
const RAPIDAPI_HOST = 'open-weather13.p.rapidapi.com';

// The screenshot showed this host and a /city endpoint.
// If your RapidAPI listing shows a different endpoint or required query parameters,
// copy its exact URL format here. {city} will be replaced with the searched city.
const ENDPOINT_TEMPLATE = "https://open-weather13.p.rapidapi.com/city?city={city}&lang=EN";

const $ = (id) => document.getElementById(id);
const form = $("searchForm");
const cityInput = $("cityInput");
const searchBtn = $("searchBtn");
const notice = $("notice");
const noticeText = $("noticeText");

function setNotice(message, type = "") {
  notice.className = `notice ${type}`.trim();
  noticeText.textContent = message;
  notice.style.display = "flex";
}
$("dismissNotice").addEventListener("click", () => { notice.style.display = "none"; });

function weatherEmoji(description = "", main = "") {
  const text = `${description} ${main}`.toLowerCase();
  if (text.includes("thunder")) return "⛈️";
  if (text.includes("snow") || text.includes("sleet")) return "🌨️";
  if (text.includes("rain") || text.includes("drizzle")) return "🌧️";
  if (text.includes("mist") || text.includes("fog") || text.includes("haze") || text.includes("smoke")) return "🌫️";
  if (text.includes("cloud")) return "☁️";
  if (text.includes("clear") || text.includes("sun")) return "☀️";
  return "🌤️";
}

function getValue(obj, paths, fallback = null) {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, key) => acc == null ? undefined : acc[key], obj);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}

function formatNumber(value, digits = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "—";
}


function getTemperature(data) {
  const temp = getValue(data, [
    "main.temp",
    "temperature",
    "temp",
    "current.temp_c",
    "current.temp"
  ]);

  if (temp == null) return null;

  // Convert Fahrenheit to Celsius
  return (Number(temp) - 32) * 5 / 9;
}


function updateWeather(data, searchedCity) {
  const description = getValue(data, ["weather.0.description", "current.condition.text", "condition.description"], "Weather conditions");
  const main = getValue(data, ["weather.0.main", "current.condition.text", "condition.main"], description);
  const temp = getTemperature(data);
  const feelsF = getValue(data, [
  "main.feels_like",
  "feels_like",
  "current.feelslike_c",
  "current.feels_like"
]);

const feels = feelsF == null
  ? null
  : (Number(feelsF) - 32) * 5 / 9;
  const humidity = getValue(data, ["main.humidity", "humidity", "current.humidity"]);
  const wind = getValue(data, ["wind.speed", "wind_speed", "current.wind_kph"]);
  const pressure = getValue(data, ["main.pressure", "pressure", "current.pressure_mb"]);
  const visibility = getValue(data, ["visibility", "current.vis_km"]);
  const windDeg = getValue(data, ["wind.deg", "wind_deg"]);
  const city = getValue(data, ["name", "city.name", "location.name"], searchedCity);
  const country = getValue(data, ["sys.country", "country"], "");
  let high = getValue(data, ["main.temp_max", "temp_max"]);
  let low = getValue(data, ["main.temp_min", "temp_min"]);

  // If the API returns Fahrenheit values (like ~80°+), convert them to Celsius
  // Formula: (°F - 32) * 5/9
  if (high != null && Number(high) > 50) {
    high = (Number(high) - 32) * (5 / 9);
  }
  if (low != null && Number(low) > 50) {
    low = (Number(low) - 32) * (5 / 9);
  }

  $("locationName").textContent = [city, country].filter(Boolean).join(", ");
  $("currentDate").textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long", month: "long", day: "numeric", year: "numeric"
  }).format(new Date());
  $("currentWeatherTitle").innerHTML = `${temp == null ? "—" : formatNumber(temp)}°<span>C</span>`;
  $("conditionText").textContent = String(description);
  $("feelsLike").textContent = feels == null ? "Feels-like temperature unavailable" : `Feels like ${formatNumber(feels)}°C`;
  $("weatherEmoji").textContent = weatherEmoji(description, main);
  $("highLow").textContent = high == null || low == null ? "H —° / L —°" : `H ${formatNumber(high)}° / L ${formatNumber(low)}°`;
  $("sunSummary").textContent = /rain|storm|thunder/i.test(`${description} ${main}`) ? "Carry an umbrella" :
    /clear|sun/i.test(`${description} ${main}`) ? "Enjoy the sunshine" : "Check conditions before heading out";

  $("humidityValue").textContent = humidity == null ? "—" : formatNumber(humidity);
  $("humidityBar").style.width = humidity == null ? "0%" : `${Math.max(0, Math.min(100, Number(humidity)))}%`;
  $("humidityHint").textContent = humidity == null ? "Not provided" : Number(humidity) > 70 ? "Humid conditions" : Number(humidity) < 30 ? "Dry air" : "Moderate moisture";
  $("windValue").textContent = wind == null ? "—" : formatNumber(wind, 1);
  $("windBar").style.width = wind == null ? "0%" : `${Math.max(0, Math.min(100, Number(wind) * 10))}%`;
  $("windHint").textContent = wind == null ? "Not provided" : Number(wind) > 8 ? "Breezy conditions" : "Light to moderate";
  $("pressureValue").textContent = pressure == null ? "—" : formatNumber(pressure);
  $("visibilityValue").textContent = visibility == null ? "—" : formatNumber(Number(visibility) > 100 ? Number(visibility) / 1000 : visibility, 1);
  $("detailTemp").textContent = temp == null ? "—" : `${formatNumber(temp)}°C`;
  $("dewPoint").textContent = "—";
  $("windDirection").textContent = windDeg == null ? "—" : `${windDirection(Number(windDeg))} (${windDeg}°)`;
  $("lastUpdated").textContent = `Updated ${new Intl.DateTimeFormat(undefined, {hour:"2-digit", minute:"2-digit"}).format(new Date())}`;

  const rain = /rain|storm|thunder/i.test(`${description} ${main}`);
  const hot = temp != null && Number(temp) >= 32;
  const cold = temp != null && Number(temp) <= 12;
  $("tipEmoji").textContent = rain ? "☔" : hot ? "🧴" : cold ? "🧥" : "🌤️";
  $("tipTitle").textContent = rain ? "Keep an umbrella handy" : hot ? "Stay cool and hydrated" : cold ? "A light jacket may help" : "A good time to get outside";
  $("tipText").textContent = rain
    ? "Rain or stormy conditions are reported. Consider carrying an umbrella and checking the sky before travelling."
    : hot ? "Temperatures are on the warm side. Drink water regularly and try to limit long periods in direct sunlight."
    : cold ? "It may feel chilly outside. Consider an extra layer, especially early in the morning or after sunset."
    : "Conditions look fairly comfortable based on the current report. Check again before outdoor plans, as weather can change.";
}

function windDirection(degrees) {
  const directions = ["N","NE","E","SE","S","SW","W","NW"];
  return directions[Math.round(degrees / 45) % 8];
}

async function getWeather(city) {
  if (!RAPIDAPI_KEY || RAPIDAPI_KEY === "PASTE_YOUR_RAPIDAPI_KEY_HERE") {
    setNotice("Add your RapidAPI key in script.js before requesting live weather.", "error");
    return;
  }

  const url = ENDPOINT_TEMPLATE.replace("{city}", encodeURIComponent(city.trim()));
  searchBtn.disabled = true;
  searchBtn.innerHTML = "Loading…";
  setNotice(`Fetching current weather for ${city}…`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST
      }
    });

    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = { message: raw }; }

    if (!response.ok) {
      const message = data.message || data.error || `HTTP ${response.status}`;
      throw new Error(`${response.status}: ${message}`);
    }

    updateWeather(data, city.trim());
    setNotice(`Weather loaded successfully for ${getValue(data, ["name", "city.name"], city)}.`, "success");
  } catch (error) {
    console.error("Weather API error:", error);
    setNotice(`Could not load weather. ${error.message}. Check your API key, host, endpoint and RapidAPI subscription.`, "error");
  } finally {
    searchBtn.disabled = false;
    searchBtn.innerHTML = 'Search <span>→</span>';
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    setNotice("Please enter a city name.", "error");
    cityInput.focus();
    return;
  }
  getWeather(city);
});

$("useLocationBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    setNotice("Geolocation is not supported by this browser.", "error");
    return;
  }
  setNotice("Requesting your location…");
  navigator.geolocation.getCurrentPosition(async (position) => {
    // This RapidAPI city endpoint expects a city name. Reverse geocoding is not assumed.
    setNotice("Location permission granted. This API endpoint searches by city name; enter your nearest city in the search box.", "error");
    cityInput.focus();
  }, () => setNotice("Location permission was denied or unavailable. Search by city name instead.", "error"));
});

// Keep the dashboard useful before the key is configured, without inventing live data.
$("currentDate").textContent = new Intl.DateTimeFormat(undefined, {
  weekday: "long", month: "long", day: "numeric", year: "numeric"
}).format(new Date());
$("searchForm").addEventListener("reset", () => {});
