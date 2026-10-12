# SkyCast Weather Forecasting Website

A responsive college-project weather dashboard built with HTML, CSS and vanilla JavaScript. It includes city search, current weather, humidity, wind speed, pressure, visibility, weather-condition icons, and a simple condition-based tip.

## Setup

1. Extract `SkyCast-Weather-Website.zip`.
2. Open the folder in VS Code.
3. In `script.js`, replace:
   - `PASTE_YOUR_RAPIDAPI_KEY_HERE` with your RapidAPI key.
   - `RAPIDAPI_HOST` and `ENDPOINT_TEMPLATE` if your selected RapidAPI listing shows different values.
4. The screenshot you shared showed the host `open-weather13.p.rapidapi.com` and a `/city` endpoint. Confirm the exact endpoint and query parameters under that listing's Code Snippets. The included template is based on that visible setup.
5. Open `index.html` with VS Code Live Server and search for a city.

## Important

- The API key in front-end JavaScript is visible to visitors. For a public website, call RapidAPI from a small backend and keep the key in an environment variable.
- The API listing's response shape may vary. `script.js` supports common OpenWeather field names, but check the JSON returned by your exact endpoint if a field displays as `—`.
- This project displays current conditions. It does not fabricate a multi-day forecast. Add a forecast endpoint only if your chosen RapidAPI subscription supports one.
- `use my location` is a UI placeholder because the configured city endpoint searches by city name and no reverse-geocoding endpoint is assumed.
