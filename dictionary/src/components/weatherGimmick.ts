export async function fetchWeather(city: string = 'Jakarta') {
  const apiKey = 'YOUR_API_KEY'; // Ganti dengan API Key OpenWeatherMap Anda
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    const data = await response.json();
    const weatherMessage = `Weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
    
    this.notificationMessage = weatherMessage;
    this.notificationClass = 'info-notification';
  } catch (error) {
    console.error('Weather Fetch Error:', error);
    this.notificationMessage = 'Failed to fetch weather data!';
    this.notificationClass = 'error-notification';
  }
}
