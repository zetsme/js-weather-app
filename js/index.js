import CurrentLocation from './CurrentLocation.js';
import {
  setCurrentLocationObj,
  removeSpacesAndTrim,
  getWeatherFromApiByCoords,
  getCoordsFromApi,
} from './dataFunctions.js';
import { saveToLocalStorage, getFromLocalStorage } from './localStorage.js';
import { displayError, updateDisplay } from './domFunctions.js';

const currentLocation = new CurrentLocation();

const start = () => {
  const locationBtn = document.getElementById('location-btn');
  locationBtn.addEventListener('click', getGeoData);
  const homeBtn = document.getElementById('home-btn');
  homeBtn.addEventListener('click', loadWeather);
  const saveBtn = document.getElementById('save-btn');
  saveBtn.addEventListener('click', saveLocation);
  const unitsBtn = document.getElementById('units-btn');
  unitsBtn.addEventListener('click', setUnits);
  const refreshBtn = document.getElementById('refresh-btn');
  refreshBtn.addEventListener('click', refreshWeather);
  const languageSelect = document.getElementById('language-select');
  languageSelect.addEventListener('change', setLanguage);
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', submitSearchForm);

  loadWeather();
  setLanguageAttribute();
};

const setLanguageAttribute = () => {
  let data = getFromLocalStorage();
  if (typeof data === 'string') {
    data = JSON.parse(data);
    const root = document.documentElement;
    root.setAttribute('lang', data.language);
    document.getElementById('language-select').value = data.language;
    currentLocation.language = data.language;
  }
};

const setUnits = () => {
  currentLocation.toggleUnit();
  updateDataAndDisplay(currentLocation);
};

const setLanguage = (e) => {
  const root = document.documentElement;
  currentLocation.language = e.target.value;
  root.setAttribute('lang', currentLocation.language);
  saveLocation();
  updateDataAndDisplay(currentLocation);
};
const refreshWeather = () => {
  updateDataAndDisplay(currentLocation);
};

const getGeoData = () => {
  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
  const errMsg = errObj ? errObj.message : 'Geolocation not Supported';
  displayError(errMsg);
};

const geoSuccess = (position) => {
  const obj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    locationName: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`,
  };
  setCurrentLocationObj(currentLocation, obj);
  updateDataAndDisplay(currentLocation);
};

const saveLocation = () => {
  if (currentLocation.lat && currentLocation.lon) {
    const obj = {
      locationName: currentLocation.locationName,
      lat: currentLocation.lat,
      lon: currentLocation.lon,
      unit: currentLocation.unit,
      language: currentLocation.language,
    };
    saveToLocalStorage(obj);
  }
};

const loadWeather = (e) => {
  const savedLocation = getFromLocalStorage();
  if (!savedLocation && !e) return getGeoData();
  if (!savedLocation && e.type === 'click') {
    displayError('No Home Location Saved');
  } else if (savedLocation && !e) {
    displayHomeLocationWeather(savedLocation);
  } else {
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (locationStringFromLocalStorage) => {
  if (typeof locationStringFromLocalStorage === 'string') {
    const locationJSON = JSON.parse(locationStringFromLocalStorage);
    setCurrentLocationObj(currentLocation, locationJSON);
    updateDataAndDisplay(currentLocation);
  }
};
const submitSearchForm = async (e) => {
  e.preventDefault();
  let textValue = document.getElementById('search-input').value;
  textValue = removeSpacesAndTrim(textValue);
  if (!textValue.length) return;

  const coordsData = await getCoordsFromApi(
    textValue,
    currentLocation.unit,
    currentLocation.language
  );

  if (coordsData) {
    const obj = {
      lat: coordsData.coord.lat,
      lon: coordsData.coord.lon,
      locationName: coordsData.sys.country
        ? `${coordsData.name}, ${coordsData.sys.country}`
        : coordsData.name,
    };
    setCurrentLocationObj(currentLocation, obj);
    updateDataAndDisplay(currentLocation);
  } else {
    displayError('Connection Error');
  }
};

const updateDataAndDisplay = async (locationObj) => {
  const weatherJSON = await getWeatherFromApiByCoords(locationObj);
  updateDisplay(weatherJSON, locationObj);
};

start();
