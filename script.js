const guiContainer = document.getElementById("gui-container");
const textForm = document.getElementById("text-form");
const textInput = document.getElementById("text-input");
const colorPicker = document.getElementById("color-picker");
const guiToggle = document.getElementById("gui-toggle");
const saveButton = document.getElementById("save-button");
const title = document.querySelector(".title");
const fontSizeSlider = document.getElementById("font-size-slider");
const fontSelect = document.getElementById("font-select");
const clearButton = document.getElementById("clear-button");
const gradientToggle = document.getElementById("gradient-toggle");
const gradientEndPicker = document.getElementById("gradient-end-picker");
const rotationSlider = document.getElementById("rotation-slider");
const rotationValue = document.getElementById("rotation-value");

let selectedFont = "Arial";
let clearCount = 0;
let messageDisplayed = false;
let didBroEvenPressCtrlZBefore = false;
let mouseStartX = 0;
let mouseStartY = 0;
let guiOffsetX = 0;
let guiOffsetY = 0;
let fontSize = 20;
let isDrawing = false;
let textRotation = 0;

const pastedTextElements = [];

fontSelect.addEventListener("change", () => {
  selectedFont = fontSelect.value;
  textInput.style.fontFamily = selectedFont;
});

fontSizeSlider.addEventListener("input", () => {
  fontSize = parseInt(fontSizeSlider.value);
});

colorPicker.addEventListener("input", () => {
  const color = colorPicker.value;
  title.style.color = color;
  guiContainer.style.border = `2px solid ${color}`;
  textInput.style.color = color;
  textInput.style.border = `2px solid ${color}`;
});

rotationSlider.addEventListener("input", () => {
  textRotation = parseInt(rotationSlider.value);
  rotationValue.innerText = `${textRotation}°`;
});

function handleUndo() {
  if (pastedTextElements.length > 0) {
    const lastElement = pastedTextElements.pop();
    lastElement.remove();
    didBroEvenPressCtrlZBefore = true;
  }
}

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "z") {
    handleUndo();
  }
});

function setGuiPosition(x, y) {
  guiContainer.style.left = `${x - guiOffsetX}px`;
  guiContainer.style.top = `${y - guiOffsetY}px`;
}

function handleSaveClick() {
  const elements = document.getElementsByClassName("pasted-text");
  const images = document.querySelectorAll("img");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Include text elements
  for (let i = 0; i < elements.length; i++) {
    const rect = elements[i].getBoundingClientRect();
    minX = Math.min(minX, rect.left);
    minY = Math.min(minY, rect.top);
    maxX = Math.max(maxX, rect.right);
    maxY = Math.max(maxY, rect.bottom);
  }

  // Include uploaded images
  images.forEach(img => {
    const rect = img.getBoundingClientRect();
    minX = Math.min(minX, rect.left);
    minY = Math.min(minY, rect.top);
    maxX = Math.max(maxX, rect.right);
    maxY = Math.max(maxY, rect.bottom);
  });

  if (!isFinite(minX)) return; // nothing to save

  const width = maxX - minX;
  const height = maxY - minY;

  canvas.width = width;
  canvas.height = height;

  const backgroundColor = getComputedStyle(document.body).backgroundColor;
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw images first (so text stays on top like your app visually)
  images.forEach(img => {
    const rect = img.getBoundingClientRect();
    const x = rect.left - minX;
    const y = rect.top - minY;
    ctx.drawImage(img, x, y, rect.width, rect.height);
  });

  // Draw text
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const rect = element.getBoundingClientRect();
    const x = rect.left - minX;
    const y = rect.top - minY;

    const color = element.style.color;
    const size = parseInt(element.style.fontSize);
    const rotationMatch = element.style.transform.match(/rotate\((-?\d+)deg\)/);
    const rotation = rotationMatch ? parseInt(rotationMatch[1]) : 0;

    ctx.save();
    ctx.translate(x, y + size);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.font = `${size}px ${element.style.fontFamily}`;

    if (element.dataset.gradient === "true") {
      const textWidth = ctx.measureText(element.innerText).width;
      const gradient = ctx.createLinearGradient(0, 0, textWidth, 0);
      gradient.addColorStop(0, element.dataset.gradientStart || color);
      gradient.addColorStop(1, element.dataset.gradientEnd || color);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = color;
    }

    ctx.fillText(element.innerText, 0, 0);
    ctx.restore();
  }

  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "canvas-unlimited.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

saveButton.addEventListener("click", handleSaveClick);
// Mobile Undo Button
const mobileUndo = document.createElement("button");
mobileUndo.innerText = "↺";
mobileUndo.style.position = "fixed";
mobileUndo.style.bottom = "10px";
mobileUndo.style.right = "10px";
mobileUndo.style.background = "#333";
mobileUndo.style.color = "#fff";
mobileUndo.style.border = "none";
mobileUndo.style.borderRadius = "13px";
mobileUndo.style.padding = "13px";
mobileUndo.style.zIndex = "3";
mobileUndo.style.fontSize = "16px";
mobileUndo.style.display = "none";

mobileUndo.addEventListener("click", handleUndo);
document.body.appendChild(mobileUndo);

// Show only on mobile
if (/Mobi|Android/i.test(navigator.userAgent)) {
  mobileUndo.style.display = "block";
}


function handleGuiMouseDown(event) {
  mouseStartX = event.clientX;
  mouseStartY = event.clientY;
  guiOffsetX = mouseStartX - guiContainer.offsetLeft;
  guiOffsetY = mouseStartY - guiContainer.offsetTop;
  document.addEventListener("mousemove", handleGuiMouseMove);
  document.addEventListener("mouseup", handleGuiMouseUp);
}

function handleGuiMouseMove(event) {
  setGuiPosition(event.clientX, event.clientY);
}

function handleGuiMouseUp() {
  document.removeEventListener("mousemove", handleGuiMouseMove);
  document.removeEventListener("mouseup", handleGuiMouseUp);
}

let lastText = "";

function handleSubmit(event) {
  event.preventDefault();

  const text = textInput.value.trim();
  lastText = text;
  textInput.value = "";

  if (text) {
    fontSizeSlider.style.display = "block";
    fontSizeSlider.value = 15;
  }

  guiContainer.style.display = "none";

  document.removeEventListener("click", handleClick);
  document.addEventListener("click", handleClick);
}

function applyTextStyles(textElement) {
  textElement.style.color = colorPicker.value;
  textElement.style.userSelect = "none";
  textElement.style.fontSize = `${fontSize}px`;
  textElement.style.pointerEvents = "none";
  textElement.style.fontFamily = selectedFont;
  textElement.style.transform = `rotate(${textRotation}deg)`;

  if (gradientToggle.checked) {
    textElement.style.backgroundImage = `linear-gradient(90deg, ${colorPicker.value}, ${gradientEndPicker.value})`;
    textElement.style.webkitBackgroundClip = "text";
    textElement.style.backgroundClip = "text";
    textElement.style.webkitTextFillColor = "transparent";
    textElement.dataset.gradient = "true";
    textElement.dataset.gradientStart = colorPicker.value;
    textElement.dataset.gradientEnd = gradientEndPicker.value;
  }
}

function handleClick(event) {
  const openGuiButton = document.getElementById("gui-toggle");

  if (guiContainer.style.display !== "none") return;

  if (
    event.target.id === "upload-button" ||
    event.target.id === "clear-button" ||
    event.target.id === "remove-images-button" ||
    event.target.id === "save-button"
  ) return;

  const buttonRect = openGuiButton.getBoundingClientRect();
  if (
    event.clientX >= buttonRect.left &&
    event.clientX <= buttonRect.right &&
    event.clientY >= buttonRect.top &&
    event.clientY <= buttonRect.bottom
  ) return;

  if (!isDrawing) {
    const textElement = document.createElement("div");
    textElement.classList.add("pasted-text");
    textElement.innerText = lastText;
    textElement.style.position = "absolute";
    textElement.style.zIndex = "1";
    applyTextStyles(textElement);

    document.body.appendChild(textElement);

    const textWidth = textElement.offsetWidth;
    const textHeight = textElement.offsetHeight;

    const centerX = event.clientX + window.scrollX - textWidth / 2;
    const centerY = event.clientY + window.scrollY - textHeight / 2;

    textElement.style.top = `${centerY}px`;
    textElement.style.left = `${centerX}px`;

    pastedTextElements.push(textElement);
  }
}

document.addEventListener("mousedown", (event) => {
  if (guiContainer.style.display !== "none") return;

  if (
    event.target.id === "upload-button" ||
    event.target.id === "clear-button" ||
    event.target.id === "remove-images-button" ||
    event.target.id === "save-button"
  ) return;

  isDrawing = true;
});

document.addEventListener("mouseup", () => {
  isDrawing = false;
});

document.addEventListener("mousemove", (event) => {
  if (isDrawing) {
    const textElement = document.createElement("div");
    textElement.classList.add("pasted-text");
    textElement.innerText = lastText;
    textElement.style.position = "absolute";
    textElement.style.zIndex = "1";
    applyTextStyles(textElement);

    document.body.appendChild(textElement);

    const textWidth = textElement.offsetWidth;
    const textHeight = textElement.offsetHeight;

    const centerX = event.clientX + window.scrollX - textWidth / 2;
    const centerY = event.clientY + window.scrollY - textHeight / 2;

    textElement.style.top = `${centerY}px`;
    textElement.style.left = `${centerX}px`;

    pastedTextElements.push(textElement);
  }
});

function handleClearClick() {
  isDrawing = false;

  const elements = document.getElementsByClassName("pasted-text");
  while (elements.length > 0) {
    elements[0].remove();
  }

  pastedTextElements.length = 0;

  clearCount++;

  if (clearCount >= 3 && !messageDisplayed && !didBroEvenPressCtrlZBefore) {
    document.body.style.backgroundColor = "black";
    document.body.style.transition = "background-color 1s ease-in-out";
    document.body.style.color = "red";

    // ✅ Added visible undo hint
    const hint = document.createElement("div");
    hint.innerText = "ctrl z to undo :)";
    hint.style.position = "fixed";
    hint.style.top = "50%";
    hint.style.left = "50%";
    hint.style.transform = "translate(-50%, -50%)";
    hint.style.fontSize = "40px";
    hint.style.fontFamily = "Georgia, serif";
    hint.style.color = "red";
    hint.style.zIndex = "9999";
    document.body.appendChild(hint);

    setTimeout(() => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      hint.remove();
    }, 2000);

    messageDisplayed = true;
  }
}

clearButton.addEventListener("click", handleClearClick);
guiContainer.addEventListener("mousedown", handleGuiMouseDown);
textForm.addEventListener("submit", handleSubmit);

function toggleGui() {
  if (guiContainer.style.display === "none") {
    guiContainer.style.display = "block";
    fontSizeSlider.style.display = "none";
    fontSizeSlider.value = 15;
    textInput.value = "";
    fontSize = 20;
    textRotation = 0;
    rotationSlider.value = 0;
    rotationValue.innerText = "0°";
  } else {
    guiContainer.style.display = "none";
  }
}

guiToggle.addEventListener("click", toggleGui);

