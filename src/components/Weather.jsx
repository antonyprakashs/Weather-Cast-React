import React, { useState, useEffect } from 'react';
import axios from 'axios';

// IMPORTANT: Replace this with your OpenWeatherMap API Key
const API_KEY = '98438a91acf019c9ac0b434bb6101bf6';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default fetch on mount
  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      
      const cityTrimmed = city.trim();
      // If the input is exactly a 6-digit number, treat it as an Indian Pincode
      if (/^[1-9][0-9]{5}$/.test(cityTrimmed)) {
        url = `https://api.openweathermap.org/data/2.5/weather?zip=${cityTrimmed},in&appid=${API_KEY}&units=metric`;
      } 
      // If the user manually specifies a zip code and country code (like '10001,us')
      else if (/^\d+,[a-zA-Z]{2}$/.test(cityTrimmed)) {
        url = `https://api.openweathermap.org/data/2.5/weather?zip=${cityTrimmed}&appid=${API_KEY}&units=metric`;
      }

      const response = await axios.get(url);
      setWeatherData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('City not found. Please check your spelling.');
      } else if (err.response && err.response.status === 401) {
        setError('Invalid API Key. Please configure your OpenWeatherMap API key in the source code.');
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  // Utility to determine background icon mapping
  const getWeatherIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  return (
    <main className="weather-container">
      <div className="glass-panel">
        <header className="weather-header">
          <h1>Weather<span>Cast</span></h1>
          <p>Real-time forecasts globally</p>
        </header>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter city name, PinCode..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <section className="weather-content">
          {loading && (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>Fetching weather data...</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && weatherData && (
            <article className="weather-card">
              <h2 className="city-name">
                {weatherData.name}, <span>{weatherData.sys.country}</span>
              </h2>
              
              <div className="weather-condition">
                <img 
                  src={getWeatherIconUrl(weatherData.weather[0].icon)} 
                  alt={weatherData.weather[0].description} 
                  className="weather-icon"
                />
                <div className="temperature">
                  {Math.round(weatherData.main.temp)}&deg;C
                </div>
                <div className="description">
                  {weatherData.weather[0].description}
                </div>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <span className="label">Feels Like</span>
                  <span className="value">{Math.round(weatherData.main.feels_like)}&deg;</span>
                </div>
                <div className="detail-item">
                  <span className="label">Humidity</span>
                  <span className="value">{weatherData.main.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="label">Wind</span>
                  <span className="value">{weatherData.wind.speed} m/s</span>
                </div>
                <div className="detail-item">
                  <span className="label">Pressure</span>
                  <span className="value">{weatherData.main.pressure} hPa</span>
                </div>
                <div className="detail-item">
                  <span className="label">Min Temp</span>
                  <span className="value">{Math.round(weatherData.main.temp_min)}&deg;C</span>
                </div>
                <div className="detail-item">
                  <span className="label">Max Temp</span>
                  <span className="value">{Math.round(weatherData.main.temp_max)}&deg;C</span>
                </div>
                <div className="detail-item">
                  <span className="label">Sunrise</span>
                  <span className="value">{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Sunset</span>
                  <span className="value">{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </article>
          )}
        </section>
      </div>
    </main>
  );
};

export default Weather;
