export const setBackgroundImage = (weatherClass) => {
  const bodyEl = document.body;
  bodyEl.classList.add(weatherClass);
  bodyEl.classList.forEach((className) => {
    if (className !== weatherClass) bodyEl.classList.remove(className);
  });
};
export const translateIconToFontAwesome = (icon) => {
  const i = document.createElement('i');
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  switch (firstTwoChars) {
    case '01':
      if (lastChar === 'd') {
        i.classList.add('far', 'fa-sun');
      } else {
        i.classList.add('far', 'fa-moon');
      }
      break;
    case '02':
      if (lastChar === 'd') {
        i.classList.add('fas', 'fa-cloud-sun');
      } else {
        i.classList.add('fas', 'fa-cloud-moon');
      }
      break;
    case '03':
      i.classList.add('fas', 'fa-cloud');
      break;
    case '04':
      i.classList.add('fas', 'fa-cloud-meatball');
      break;
    case '09':
      i.classList.add('fas', 'fa-cloud-rain');
      break;
    case '10':
      if (lastChar === 'd') {
        i.classList.add('fas', 'fa-cloud-sun-rain');
      } else {
        i.classList.add('fas', 'fa-cloud-moon-rain');
      }
      break;
    case '11':
      i.classList.add('fas', 'fa-poo-storm');
      break;
    case '13':
      i.classList.add('far', 'fa-snowflake');
      break;
    case '50':
      i.classList.add('fas', 'fa-smog');
      break;
    default:
      i.classList.add('far', 'fa-question-circle');
  }
  return i;
};

export const getWeatherClass = (icon) => {
  const weather = icon.slice(0, 2);
  const dayTime = icon.slice(2);
  const weatherLookup = {
    '09': 'snow',
    10: 'rain',
    11: 'rain',
    13: 'snow',
    50: 'fog',
  };
  let weatherClass;
  if (weatherLookup[weather]) {
    weatherClass = weatherLookup[weather];
  } else if (dayTime === 'd') {
    weatherClass = 'clouds';
  } else {
    weatherClass = 'night';
  }
  return weatherClass;
};
