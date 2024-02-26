const apiKey = '91fed22525b83ad8a5106b523550b78c';

function getCityCoordinates(city) {
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud de red');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                return { latitude: lat, longitude: lon };
            } else {
                throw new Error('Ciudad no encontrada');
            }
        });
}

function getWeatherByCoordinates(latitude, longitude) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud de red');
            }
            return response.json();
        });
}

function updateUI(data) {
    const cityName = data.name;
    const countryName = data.sys.country;
    const temperature = data.main.temp;
    const weatherDescription = data.weather[0].description;

    document.querySelector('.city').textContent = cityName;
    document.querySelector('.country').textContent = countryName;
    document.querySelector('.temperature').textContent = `${temperature}°C`;
    document.querySelector('.description').textContent = weatherDescription;

    // Cambiar el icono dependiendo de la temperatura
    const weatherIcon = document.querySelector('.weather-icon img');
    if (temperature <= 15) {
        weatherIcon.src = 'snow-icon.png';
        weatherIcon.alt = 'Nieve';
        weatherIcon.style.display = 'block'; // Mostrar el icono
    } else {
        weatherIcon.src = 'sun-icon.png';
        weatherIcon.alt = 'Sol';
        weatherIcon.style.display = 'block'; // Mostrar el icono
    }

    // Guardar la última ubicación buscada en LocalStorage
    localStorage.setItem('lastLocation', JSON.stringify({ city: cityName, country: countryName }));
}

function loadLastLocation() {
    const lastLocation = JSON.parse(localStorage.getItem('lastLocation'));
    if (lastLocation) {
        const { city, country } = lastLocation;
        getCityCoordinates(`${city},${country}`)
            .then(coordinates => getWeatherByCoordinates(coordinates.latitude, coordinates.longitude))
            .then(data => {
                updateUI(data);
            })
            .catch(error => {
                console.error('Error:', error.message);
            });
    }
}

document.getElementById('searchButton').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    getCityCoordinates(city)
        .then(coordinates => getWeatherByCoordinates(coordinates.latitude, coordinates.longitude))
        .then(data => {
            updateUI(data);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
});

// Cargar automáticamente la última ubicación buscada al cargar la página
loadLastLocation();