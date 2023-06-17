const apiKey = "1c123fe974a57a33caacae83b9afc17f";
const apiUrl = "https://api.openweathermap.org/data/2.5";

function getWeatherByLocation(latitude, longitude) {
  const url = `${apiUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=pt_br&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const city = data.name;
      const country = data.sys.country;
      const temperature = Math.round(data.main.temp);
      const description = data.weather[0].description;
      const icon = data.weather[0].icon;

      const placeText = `${city}, ${country}`;
      document.getElementById("city").innerText = placeText;
      document.getElementById("temperature").innerText = `${temperature} °C`;
      document.getElementById("clouds").innerText = description;

      const iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
      document.getElementById("img").src = iconUrl;
    })
    .catch((error) => {
      console.log(error);
    });
}

function getForecastByLocation(latitude, longitude) {
  const url = `${apiUrl}/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=pt_br&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const forecastList = data.list;

      const hourForecastElement = document.querySelector(".templist");
      hourForecastElement.innerHTML = "";

      for (let i = 0; i < 5; i++) {
        const forecast = forecastList[i];
        const timestamp = forecast.dt;
        const temperature = Math.round(forecast.main.temp);
        const description = forecast.weather[0].description;

        const date = new Date(timestamp * 1000);
        const dayOfWeek = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
        const dayOfMonth = date.getDate();
        const month = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);

        const hourForecast = document.createElement("div");
        hourForecast.classList.add("next");

        const div = document.createElement("div");
        const timeElement = document.createElement("p");
        timeElement.classList.add("time");
        timeElement.innerText = `${dayOfWeek.substr(0, 3)}, ${dayOfMonth} ${month.substr(0, 3)}`;

        const tempElement = document.createElement("p");
        tempElement.innerText = `${temperature} °C`;

        div.appendChild(timeElement);
        div.appendChild(tempElement);

        const descElement = document.createElement("p");
        descElement.classList.add("desc");
        descElement.innerText = description;

        hourForecast.appendChild(div);
        hourForecast.appendChild(descElement);

        hourForecastElement.appendChild(hourForecast);
      }

      const dayForecastElement = document.querySelector(".weekF");
      dayForecastElement.innerHTML = "";

      for (let i = 0; i < 4; i++) {
        const forecast = forecastList[i * 8];
        const timestamp = forecast.dt;
        const temperatureMax = Math.round(forecast.main.temp_max);
        const temperatureMin = Math.round(forecast.main.temp_min);
        const description = forecast.weather[0].description;

        const date = new Date(timestamp * 1000);
        const dayOfWeek = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
        const dayOfMonth = date.getDate();
        const month = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);

        const dayForecast = document.createElement("div");
        dayForecast.classList.add("dayF");

        const dayElement = document.createElement("p");
        dayElement.classList.add("date");
        dayElement.innerText = `${dayOfWeek.substr(0, 3)}, ${dayOfMonth} ${month.substr(0, 3)}`;

        const tempElement = document.createElement("p");
        tempElement.innerText = `${temperatureMax} °C / ${temperatureMin} °C`;

        const descElement = document.createElement("p");
        descElement.classList.add("desc");
        descElement.innerText = description;

        dayForecast.appendChild(dayElement);
        dayForecast.appendChild(tempElement);
        dayForecast.appendChild(descElement);

        dayForecastElement.appendChild(dayForecast);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function buttonByCity() {
  const place = document.getElementById("input").value;
  const url = `${apiUrl}/weather?q=${place}&appid=${apiKey}&lang=pt_br&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const latitude = data.coord.lat;
      const longitude = data.coord.lon;
      getWeatherByLocation(latitude, longitude);
      getForecastByLocation(latitude, longitude);
    })
    .catch((error) => {
      console.log(error);
    });

  document.getElementById("input").value = "";
}

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getWeatherByLocation(latitude, longitude);
      getForecastByLocation(latitude, longitude);
    });
  }
});
