const form = document.querySelector('form')

async function getCityData(city) {
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
    const data = await response.json()

    let cityObj = {
      name: data.results[0].name,
      country: data.results[0].country,
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      timezone: data.results[0].timezone,
      population: data.results[0].population
    }

    return cityObj

  } catch (error) {
    console.log(error);
  }
}

async function getWeatherData(latitude, longitude) {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
    const data = await response.json()

    let weatherObj = {
      temperatureMax: data.daily.temperature_2m_max[0],
      temperatureMin: data.daily.temperature_2m_min[0],
      temperatureMaxUnit: data.daily_units.temperature_2m_max,
      temperatureMinUnit: data.daily_units.temperature_2m_min,
      currentTemperature: data.current.temperature_2m,
      currentTemperatureUnit: data.current_units.temperature_2m,
      isDay: data.current.is_day
    }

    return weatherObj

  } catch (error) {
    console.log(error);
  }
}

// submit action
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const cityInput = formData.get('city')

  try {
    // get city data
    const cityData = await getCityData(cityInput)

    // get weather data
    const weatherData = await getWeatherData(cityData.latitude, cityData.longitude)

    // create and add html

    // add data table
    const resultTable = document.querySelector('.result-table')
    resultTable.innerHTML = `<tr><th>Country</th><td>${cityData.country}</td></tr><tr><th>Timezone</th><td>${cityData.timezone}</td></tr><tr><th>Population</th><td>${cityData.population}</td></tr><tr><th>Tomorrow's forecast</th><td>Low: ${weatherData.temperatureMin} ${weatherData.temperatureMinUnit}<br>Max: ${weatherData.temperatureMax} ${weatherData.temperatureMaxUnit}</td></tr>`

    // set daily/night mode and image
    const body = document.querySelector('body')
    const imgWrapper = document.querySelector('.img-wrapper')
    if (weatherData.isDay === 1) {
      body.classList.add('day-mode')
      body.classList.remove('night-mode')
      imgWrapper.innerHTML = `<img src='./images/day.jpg' alt='Day Image'><div class='img-text-wrapper'><div>${cityData.name}</div><div>${weatherData.currentTemperature} ${weatherData.currentTemperatureUnit}</div></div>`
    } else if (weatherData.isDay === 0) {
      body.classList.add('night-mode')
      body.classList.remove('day-mode')
      imgWrapper.innerHTML = `<img src='./images/night.jpg' alt='Night Image'><div class='img-text-wrapper'><div>${cityData.name}</div><div>${weatherData.currentTemperature} ${weatherData.currentTemperatureUnit}</div></div>`
    }

  } catch (error) {

  }
})
