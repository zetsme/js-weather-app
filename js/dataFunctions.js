const API_KEY = '8117da03a0cf7a1f397cf7bd40447354';
export const setCurrentLocationObj = (locationObj, coordsObj) => {
  const { lat, lon, locationName, unit } = coordsObj;
  locationObj.lat = lat;
  locationObj.lon = lon;
  locationObj.locationName = locationName;
  if (unit) locationObj.unit = unit;
};

export const timeFromUnix = (time) => {
  const date = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(time * 1000));
  return date;
};

export const getDateValueFromUnix = (time, locale = 'en-US') => {
  let data = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    weekday: 'short',
    month: 'short',
  }).format(new Date(time * 1000));
  return data.split(' ');
};

export const removeSpacesAndTrim = (string) => string.replaceAll(/\s\s+/g, ' ').trim();

export const getCoordsFromApi = async (text, units, lang) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=${units}&lang=${lang}&appid=${API_KEY}`;
  try {
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    console.log(error);
  }
};
export const getWeatherFromApiByCoords = async (locationObj) => {
  const { lat, lon, unit, language } = locationObj;
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=${language}&exclude=minutely,hourly,alerts&units=${unit}&appid=${API_KEY}`;
  try {
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    console.log(error);
  }
};
