const getSunTime = (sunrise, sunset) => {
  const sunriseTimestamp = sunrise;
  const sunsetTimestamp = sunset;

  const sunriseDate = new Date(sunriseTimestamp * 1000);
  const sunsetDate = new Date(sunsetTimestamp * 1000);

  // Format the Date objects into readable time
  const options = { hour: "2-digit", minute: "2-digit" }; 

  const sunriseTime = sunriseDate.toLocaleTimeString("en-US", options);
  const sunsetTime = sunsetDate.toLocaleTimeString("en-US", options);

  return { sunriseTime, sunsetTime }
};

module.exports = {
    getSunTime
}