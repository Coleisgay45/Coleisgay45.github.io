const apiKey = "790dfc6682e59d2079dace36f32e5125";
const currentWeatherDiv = document.querySelector(".currentWeather");
const endpointBase = "https://api.openweathermap.org/data/2.5/weather";

// Default coordinates for Denver, CO
let latitude = 39.7392;
let longitude = -104.9903;

// Fetch and display weather for given coordinates
function fetchWeather(lat, lon) {
  const endpoint = `${endpointBase}?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      const cityName = data.name;
      const temperatureK = data.main.temp;
      const temperatureF = ((temperatureK - 273.15) * 9/5 + 32).toFixed(2);
      const weatherDescription = data.weather[0].description;

      currentWeatherDiv.innerHTML = `
        <h2>Current Weather in ${cityName}</h2>
        <p>Temperature: ${temperatureF} °F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Condition: ${weatherDescription}</p>
      `;
    })
    .catch((error) => {
      console.error("Error fetching the weather data:", error);
      currentWeatherDiv.innerHTML = "<p>Oops! Something went wrong while fetching the weather data.</p>";
    });
}

// Initial fetch for Denver
fetchWeather(latitude, longitude);

// Listen for Enter key on input fields
["lat", "long"].forEach((name) => {
  const input = document.querySelector(`input[name='${name}']`);
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const latInput = document.querySelector("input[name='lat']").value;
      const longInput = document.querySelector("input[name='long']").value;
      if (latInput && longInput) {
        fetchWeather(latInput, longInput);
      }
    }
  });
});
