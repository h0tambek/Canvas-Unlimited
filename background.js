const changeColorButton = document.getElementById('change-color-button');
const colorPickerContainer = document.getElementById('color-picker-container');
const bolor = document.getElementById('bolor-picker');

changeColorButton.addEventListener('click', () => {
  if (colorPickerContainer.style.display === 'block') {
    colorPickerContainer.style.display = 'none';
  } else {
    colorPickerContainer.style.display = 'block';
  }});

bolor.addEventListener('input', () => {
  document.body.style.backgroundColor = bolor.value;
});bolor.addEventListener('change', () => {
  colorPickerContainer.style.display = 'none';
});