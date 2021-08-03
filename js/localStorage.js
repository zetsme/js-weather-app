export const saveToLocalStorage = (obj) => {
  localStorage.setItem('weatherLocation', JSON.stringify(obj));
};
export const getFromLocalStorage = () => {
  return localStorage.getItem('weatherLocation');
};
