const guiContainer = document.getElementById("gui-container");
const textForm = document.getElementById("text-form");
const textInput = document.getElementById("text-input");
const guiToggle = document.getElementById("gui-toggle");

let mouseStartX = 0;
let mouseStartY = 0;
let guiOffsetX = 0;
let guiOffsetY = 0;

function setGuiPosition(x, y) {
  guiContainer.style.left = `${x - guiOffsetX}px`;
  guiContainer.style.top = `${y - guiOffsetY}px`;
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
  const x = event.clientX;
  const y = event.clientY;
  setGuiPosition(x, y);
}

function handleGuiMouseUp(event) {
  document.removeEventListener("mousemove", handleGuiMouseMove);
  document.removeEventListener("mouseup", handleGuiMouseUp);
}
let lastText = "";

function handleSubmit(event) {
  event.preventDefault();
  
  const text = textInput.value.trim();
  textInput.value = "";
  lastText = text;

  guiContainer.style.display = "none";
  document.addEventListener("click", handleClick);
  
  function handleClick(event) {
	const openGuiButton = document.getElementById("gui-toggle");
	if (guiContainer.style.display !== "none") {
		return;
	  }
	const buttonRect = openGuiButton.getBoundingClientRect();
	if (event.clientX >= buttonRect.left && event.clientX <= buttonRect.right && event.clientY >= buttonRect.top && event.clientY <= buttonRect.bottom) {
	  return;
	}
	const textElement = document.createElement("div");
	textElement.classList.add("pasted-text");
	textElement.innerText = lastText;
	textElement.style.position = "absolute";
	textElement.style.zIndex = "0.5"; 

	
	const textWidth = textElement.offsetWidth;
	const textHeight = textElement.offsetHeight;
	const centerX = event.clientX - textWidth / 2;
	const centerY = event.clientY - textHeight / 2;
	
	textElement.style.top = `${centerY}px`;
	textElement.style.left = `${centerX}px`;
  
	document.body.appendChild(textElement);
  }
  
  
}

guiContainer.addEventListener("mousedown", handleGuiMouseDown);

textForm.addEventListener("submit", handleSubmit);
function toggleGui() {
	if (guiContainer.style.display === "none") {
	  guiContainer.style.display = "block";
	} else {
	  guiContainer.style.display = "none";
	}
  }
  
  guiToggle.addEventListener("click", toggleGui);