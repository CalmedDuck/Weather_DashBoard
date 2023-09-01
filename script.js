var API_KEY = "4685097139f05c53c825ce4a54c6664b";
var searchForm = document.getElementById("search-form");
var searchHistoryDiv = document.getElementById("search-history");
var currentWeatherDiv = document.getElementById("current-weather");
var forecastDiv = document.getElementById("forecast");

var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function fetchCoordinates(cityName) {
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      fetchWeatherData(lat, lon, cityName);
    });
}
