export default class CurrentLocation {
  constructor() {
    this._locationName = 'Current Location';
    this._lat = null;
    this._lon = null;
    this._unit = 'metric';
    this._language = 'en';
  }
  get locationName() {
    return this._locationName;
  }
  set locationName(locationName) {
    this._locationName = locationName;
  }
  get language() {
    return this._language;
  }
  set language(lang) {
    this._language = lang;
  }

  get lat() {
    return this._lat;
  }
  set lat(lat) {
    this._lat = lat;
  }

  get lon() {
    return this._lon;
  }
  set lon(lon) {
    this._lon = lon;
  }

  get unit() {
    return this._unit;
  }
  set unit(unit) {
    this._unit = unit;
  }
  toggleUnit() {
    this._unit = this._unit === 'metric' ? 'imperial' : 'metric';
  }
}
