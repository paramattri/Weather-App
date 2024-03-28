import { useEffect, useState } from "react";
import Search from "../search";

const Weather = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (param) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      );

      const data = await response.json();
      if (response.status === 404) throw new Error("city not found");
      if (data) setWeatherData(data);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setError(null);
    fetchWeatherData(search);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchWeatherData("delhi");
  }, []);

  return (
    <div>
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : !error ? (
        <div>
          <div className="city-name">
            <h2>
              {weatherData?.name}, <span>{weatherData?.sys?.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{getCurrentDate()}</span>
          </div>
          <div className="temperature">{weatherData?.main?.temp} &#8451;</div>
          <p className="description">
            {weatherData &&
              weatherData.weather &&
              weatherData.weather[0] &&
              weatherData.weather[0].description}
          </p>
          <div className="weather-info">
            <div className="column">
              <div>
                <p className="wind">{weatherData?.wind?.speed} m/s</p>
                <p>Wind Speed</p>
              </div>
            </div>
            <div className="column">
              <div>
                <p className="humidity">{weatherData?.main?.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loading">{error}</div>
      )}
    </div>
  );
};

export default Weather;
