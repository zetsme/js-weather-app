import { getDateValueFromUnix, timeFromUnix } from './dataFunctions.js';
import { appendToDOM, createElement } from './utils.js';
import {
  getWeatherClass,
  translateIconToFontAwesome,
  setBackgroundImage,
} from './iconsAndBackgrounds.js';

import translation from './tranlate.js';

export const displayError = (errMsg) => {
  updateWeatherLocationHeader(errMsg);
};

const updateWeatherLocationHeader = (message) => {
  const headerEl = document.getElementById('current-location');
  if (message.indexOf('Lat:') !== -1 && message.indexOf('Long:') !== -1) {
    const msgArray = message.split(' ');
    const mapArray = msgArray.map((msg) => {
      return msg.replace(':', ': ');
    });
    const lat =
      mapArray[0].indexOf('-') === -1 ? mapArray[0].slice(0, 10) : mapArray[0].slice(0, 11);
    const lon =
      mapArray[1].indexOf('-') === -1 ? mapArray[1].slice(0, 11) : mapArray[1].slice(0, 12);
    headerEl.textContent = `${lat} * ${lon}`;
  } else {
    headerEl.textContent = message;
  }
};

const normalizeTemperatureElements = () => {
  const arr = document.querySelectorAll('[data-temperature]');
  arr.forEach((el) => {
    if (Number(el.textContent) > 0) {
      el.textContent = ` +${el.textContent}°`;
    } else {
      el.textContent = ` ${el.textContent}°`;
    }
  });
};

const setButtonsTitle = () => {
  const root = document.documentElement;
  const language = root.getAttribute('lang');
  const buttons = document.querySelectorAll('.buttons [data-language]');
  buttons.forEach((btn) => {
    const btnDataLanguage = btn.dataset.language;
    btn.setAttribute('title', translation[btnDataLanguage][language]);
  });
};

export const updateDisplay = (weatherJSON, locationObj) => {
  fadeDisplay();
  clearDisplay();

  const weatherClass = getWeatherClass(weatherJSON.current.weather[0].icon);
  setBackgroundImage(weatherClass);
  updateWeatherLocationHeader(locationObj.locationName);

  createCurrentSection(weatherJSON, locationObj.unit, locationObj.language);
  createDailySection(weatherJSON.daily, locationObj.language);

  setButtonsTitle();
  normalizeTemperatureElements();
  fadeDisplay();

  document.getElementById('search-input').focus();
};

const fadeDisplay = () => {
  const current = document.getElementById('current-section');
  current.classList.toggle('zero-vis');
  current.classList.toggle('fade-in');
  const daily = document.getElementById('daily-section');
  daily.classList.toggle('zero-vis');
  daily.classList.toggle('fade-in');
};

const clearDisplay = () => {
  const current = document.getElementById('current-forecast');
  const daily = document.getElementById('daily-section');
  deleteContent(current);
  deleteContent(daily);
};

const deleteContent = (parent) => {
  let child = parent.lastElementChild;
  while (child) {
    parent.removeChild(child);
    child = parent.lastElementChild;
  }
};

const createCurrentSection = (weatherJSON, unit, language) => {
  const { current } = weatherJSON;
  const tempUnit = unit === 'metric' ? 'C' : 'F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  const currentMain = createElement('div', 'current__main');
  const temperatureEl = createElement('h2', 'current__temperature');
  const temperatureSpan = createElement('span', null, Math.round(current.temp), {
    'data-temperature': '',
  });
  const temperatureUnitSpan = createElement('span', null, tempUnit);
  const weatherIcon = translateIconToFontAwesome(current.weather[0].icon);

  const currentGrid = createElement('div', 'current__grid');

  const currentTimeEl = createElement('p', 'current__time');
  const currentTimeTextSpan = createElement('span', null, translation['current-time'][language], {
    'data-lang': 'current-time',
  });
  const currentTimeSpan = createElement('span', null, ` ${timeFromUnix(current.dt)}`);

  const feelsLikeEl = createElement('p', 'current__feelsLike');
  const feelsLikeTextSpan = createElement('span', null, translation['feels-like'][language], {
    'data-lang': 'feels-like',
  });
  const feelsLikeTemperatureSpan = createElement(
    'span',
    null,
    `${Math.round(current.feels_like)}`,
    { 'data-temperature': '' }
  );

  const sunriseEl = createElement('p', 'current__sunrise');
  const sunriseTextSpan = createElement('span', null, translation['sunrise'][language], {
    'data-lang': 'sunrise',
  });
  const sunriseTimeSpan = createElement('span', null, ` ${timeFromUnix(current.sunrise)}`);

  const sunsetEl = createElement('p', 'current__sunset');
  const sunsetTextSpan = createElement('span', null, translation['sunset'][language], {
    'data-lang': 'sunset',
  });
  const sunsetTimeSpan = createElement('span', null, ` ${timeFromUnix(current.sunset)}`);

  const windSpeedEl = createElement('p', 'current__windSpeed');
  const windSpeedTextSpan = createElement('span', null, translation['wind-speed'][language], {
    'data-lang': 'wind-speed',
  });
  const windSpeedSpan = createElement('span', null, ` ${Math.round(current.wind_speed)} `);
  const windSpeedUnitSpan = createElement('span', null, windUnit);

  const pressureEl = createElement('p', 'current__pressure');
  const pressureTextSpan = createElement('span', null, translation['pressure'][language], {
    'data-lang': 'pressure',
  });
  const pressureValueSpan = createElement(
    'span',
    null,
    ` ${Math.round(current.pressure / 1.3333)} mm`
  );

  const humidityEl = createElement('p', 'current__humidity');
  const humidityTextSpan = createElement('span', null, translation['humidity'][language], {
    'data-lang': 'humidity',
  });
  const humidityValueSpan = createElement('span', null, ` ${current.humidity}%`);

  const precipitationEl = createElement('p', 'current__precipitation');
  const precipitationTextSpan = createElement(
    'span',
    null,
    translation['precipitation'][language],
    { 'data-lang': 'precipitation' }
  );
  const precipitationValueSpan = createElement(
    'span',
    null,
    ` ${Math.round(weatherJSON.daily[0].pop * 100)} %`
  );

  appendToDOM(
    new Map([
      [temperatureEl, [temperatureSpan, temperatureUnitSpan]],
      [currentMain, [temperatureEl, weatherIcon]],
      [currentTimeEl, [currentTimeTextSpan, currentTimeSpan]],
      [feelsLikeEl, [feelsLikeTextSpan, feelsLikeTemperatureSpan]],
      [sunriseEl, [sunriseTextSpan, sunriseTimeSpan]],
      [sunsetEl, [sunsetTextSpan, sunsetTimeSpan]],
      [windSpeedEl, [windSpeedTextSpan, windSpeedSpan, windSpeedUnitSpan]],
      [pressureEl, [pressureTextSpan, pressureValueSpan]],
      [humidityEl, [humidityTextSpan, humidityValueSpan]],
      [precipitationEl, [precipitationTextSpan, precipitationValueSpan]],
      [
        currentGrid,
        [
          currentTimeEl,
          feelsLikeEl,
          sunriseEl,
          sunsetEl,
          windSpeedEl,
          pressureEl,
          humidityEl,
          precipitationEl,
        ],
      ],
      [document.getElementById('current-forecast'), [currentMain, currentGrid]],
    ])
  );
};

//
const createDailySection = (dailyArr, language) => {
  const iconSize = window.innerWidth > 500 ? '@2x' : '';
  const dailyElementsArr = dailyArr.map((el) => {
    const [day, month, date] = getDateValueFromUnix(el.dt, language);
    const dailyWeatherDiv = createElement('div', 'daily__weather', null, {
      'data-tab': Number(date),
    });
    const dailyDate = createElement('h5', 'daily__date', `${date} ${month}`);
    const dailyWeekDay = createElement('h6', 'daily__dayWeek', day);
    const dailyImage = createElement('img', 'daily__image', null, {
      src: `https://openweathermap.org/img/wn/${el.weather[0].icon}${iconSize}.png`,
    });
    const dailyMax = createElement('p', 'daily__max', Math.round(el.temp.max), {
      'data-temperature': '',
    });
    const dailyMin = createElement('p', 'daily__min', Math.round(el.temp.min), {
      'data-temperature': '',
    });
    dailyWeatherDiv.append(dailyWeekDay, dailyDate, dailyImage, dailyMax, dailyMin);
    return dailyWeatherDiv;
  });
  document.getElementById('daily-section').append(...dailyElementsArr);
};
