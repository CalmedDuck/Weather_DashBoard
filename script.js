var API_KEY = "4685097139f05c53c825ce4a54c6664b";
var searchForm = document.getElementById("search-form");
var searchHistoryDiv = document.getElementById("search-history");
var currentWeatherDiv = document.getElementById("current-weather");
var forecastDiv = document.getElementById("forecast");

var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function fetchCoordinates(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      fetchWeatherData(lat, lon, cityName);
    });
}

function fetchWeatherData(lat, lon, cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      displayWeatherData(data, cityName);
    });
}

function displayWeatherData(data, cityName) {
    var currentWeather = data.list[0];
    var currentDate = new Date(currentWeather.dt * 1000).toDateString();
    var currentTemp = ((currentWeather.main.temp - 273.15) * 9/5 + 32).toFixed(2); // Kelvin to Fahrenheit
    var currentHumidity = currentWeather.main.humidity;
    var currentWindSpeed = currentWeather.wind.speed;
  
    currentWeatherDiv.innerHTML = `
      <h2>${cityName} (${currentDate})</h2>
      <p>Temperature: ${currentTemp} °F</p>
      <p>Humidity: ${currentHumidity}%</p>
      <p>Wind Speed: ${currentWindSpeed} m/s</p>
    `;
  
    forecastDiv.innerHTML = '<h2>5-Day Forecast:</h2>';
    for(var i = 0; i < data.list.length; i += 8) { // Assuming 8 data points per day
      var forecast = data.list[i];
      var forecastDate = new Date(forecast.dt * 1000).toDateString();
      var forecastTemp = ((forecast.main.temp - 273.15) * 9/5 + 32).toFixed(2); // Kelvin to Fahrenheit
      var forecastHumidity = forecast.main.humidity;
      var forecastWindSpeed = forecast.wind.speed;
    
      forecastDiv.innerHTML += `
        <div class="forecast-day" style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
          <h3>${forecastDate}</h3>
          <p>Temperature: ${forecastTemp} °F</p>
          <p>Humidity: ${forecastHumidity}%</p>
          <p>Wind Speed: ${forecastWindSpeed} m/s</p>
        </div>
      `;
    }
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
  }
}

function renderSearchHistory() {
  searchHistoryDiv.innerHTML = '';
  searchHistory.forEach(function(city) {
    var cityDiv = document.createElement('div');
    cityDiv.textContent = city;
    cityDiv.addEventListener('click', function() {
      fetchCoordinates(city);
    });
    searchHistoryDiv.appendChild(cityDiv);
  });
}

searchForm.addEventListener("submit", function(event) {
  event.preventDefault();
  var cityName = document.getElementById("city-input").value;
  fetchCoordinates(cityName);
});

renderSearchHistory();