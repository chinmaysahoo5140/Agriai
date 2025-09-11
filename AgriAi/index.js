// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

  // --- Weather section functionality ---
  const weatherSection = document.querySelector('section:first-of-type');
  const temperatureElement = weatherSection.querySelector('.text-xl.font-bold');
  const windElement = weatherSection.querySelector('.text-sm');
  const weatherIcon = weatherSection.querySelector('div:last-of-type');

  // Asynchronous function to fetch weather data
  const fetchWeather = async () => {
    try {
      // Note: In a real-world app, you would use a weather API.
      // This is a placeholder for demonstration purposes.
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=New%20York&appid=YOUR_API_KEY');
      // A fallback for the sake of this example
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const temperature = Math.round(data.main.temp - 273.15); // Convert Kelvin to Celsius
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
      const description = data.weather[0].main;

      // Update the HTML with the fetched data
      temperatureElement.textContent = `${description}, ${temperature}°C`;
      windElement.textContent = `Wind: ${windSpeed} km/h, Humidity: ${humidity}%`;

      // Change the icon based on weather description
      // A more robust app would use a full icon set and mapping
      if (description.toLowerCase().includes('clear')) {
        weatherIcon.style.backgroundImage = 'url("https://images.unsplash.com/photo-1628169823927-440cc0f76906")';
      } else if (description.toLowerCase().includes('rain')) {
        weatherIcon.style.backgroundImage = 'url("https://images.unsplash.com/photo-1519692933481-ee8628045e78")';
      } else if (description.toLowerCase().includes('cloud')) {
        weatherIcon.style.backgroundImage = 'url("https://images.unsplash.com/photo-1502474945199-652309192461")';
      } else {
        weatherIcon.style.backgroundImage = 'url("https://images.unsplash.com/photo-1547484131-486129486a4e")';
      }

    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fallback data in case of an error
      temperatureElement.textContent = 'Sunny, 25°C';
      windElement.textContent = 'Wind: 10 km/h, Humidity: 60%';
    }
  };

  // --- Sales section functionality ---
  const totalSalesElement = document.querySelector('.grid-cols-2 > div:first-of-type .text-2xl.font-bold');
  const ordersElement = document.querySelector('.grid-cols-2 > div:last-of-type .text-2xl.font-bold');

  // Function to simulate fetching sales data
  const fetchSalesData = () => {
    // In a real application, you would make an API call here.
    const totalSales = Math.floor(Math.random() * 10000) + 10000;
    const orders = Math.floor(Math.random() * 50) + 20;

    totalSalesElement.textContent = `$${totalSales.toLocaleString()}`;
    ordersElement.textContent = orders;
  };

  // --- Inventory section functionality ---
  const tomatoStockElement = document.querySelector('.space-y-3 > div:first-of-type .font-medium');
  const lettuceStockElement = document.querySelector('.space-y-3 > div:last-of-type .font-medium');

  // Function to simulate fetching inventory data
  const fetchInventory = () => {
    // In a real application, you would make an API call here.
    const tomatoStock = Math.floor(Math.random() * 200) + 400;
    const lettuceStock = Math.floor(Math.random() * 150) + 250;

    tomatoStockElement.textContent = `${tomatoStock} kg`;
    lettuceStockElement.textContent = `${lettuceStock} kg`;
  };

  // Call the functions to populate the dashboard with dynamic data
  fetchWeather();
  fetchSalesData();
  fetchInventory();
});
