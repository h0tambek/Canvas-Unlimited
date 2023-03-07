const guiContainer = document.getElementById("gui-container");
const textForm = document.getElementById("text-form");
const textInput = document.getElementById("text-input");
const colorPicker = document.getElementById("color-picker");
const guiToggle = document.getElementById("gui-toggle");
const saveButton = document.getElementById("save-button");
 
let mouseStartX = 0;
let mouseStartY = 0;
let guiOffsetX = 0;
let guiOffsetY = 0;


function setGuiPosition(x, y) {
  guiContainer.style.left = `${x - guiOffsetX}px`;
  guiContainer.style.top = `${y - guiOffsetY}px`;
}
function handleSaveClick() {
	const elements = document.getElementsByClassName("pasted-text");
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	let minX = window.innerWidth;
	let minY = window.innerHeight;
	let maxX = 0;
	let maxY = 0;
	
	for (let i = 0; i < elements.length; i++) {
	  const element = elements[i];
	  const rect = element.getBoundingClientRect();
	  if (rect.left < minX) {
		minX = rect.left;
	  }
	  if (rect.top < minY) {
		minY = rect.top;
	  }
	  if (rect.right > maxX) {
		maxX = rect.right;
	  }
	  if (rect.bottom > maxY) {
		maxY = rect.bottom;
	  }
	}
	
	const width = maxX - minX;
	const height = maxY - minY;
	
	canvas.width = width;
	canvas.height = height;
	
	ctx.clearRect(0, 0, width, height);
  const backgroundColor = document.body.style.backgroundColor;
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const rect = element.getBoundingClientRect();
    const x = rect.left - minX;
    const y = rect.top - minY;
    const color = element.style.color;
    ctx.fillStyle = color;
    ctx.fillText(element.innerText, x, y);
  }

	for (let i = 0; i < elements.length; i++) {
	  const element = elements[i];
	  const rect = element.getBoundingClientRect();
	  const x = rect.left - minX;
	  const y = rect.top - minY;
	  const color = element.style.color;
	  ctx.fillStyle = color;
	  ctx.fillText(element.innerText, x, y);
	}
	
	const dataUrl = canvas.toDataURL("image/png");
	const link = document.createElement("a");
	link.href = dataUrl;
	link.download = "canvas-unlimited.png";
	link.click();
  }
  
  saveButton.addEventListener("click", handleSaveClick);
  
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
  const color = colorPicker.value;
  textInput.value = "";
  lastText = text;

  guiContainer.style.display = "none";
  document.addEventListener("click", handleClick);
  
  let isDrawing = false;

function handleClick(event) {
    const openGuiButton = document.getElementById("gui-toggle");
    if (guiContainer.style.display !== "none") {
        return;
    }
    const buttonRect = openGuiButton.getBoundingClientRect();
    if (event.clientX >= buttonRect.left && event.clientX <= buttonRect.right && event.clientY >= buttonRect.top && event.clientY <= buttonRect.bottom) {
        return;
    }
    if (!isDrawing) {
      
        const textElement = document.createElement("div");
        textElement.classList.add("pasted-text");
        textElement.innerText = lastText;
        textElement.style.position = "absolute";
        textElement.style.zIndex = "0.5";
        textElement.style.color = color;
        textElement.style.userSelect = "none";
        
        const textWidth = textElement.offsetWidth;
        const textHeight = textElement.offsetHeight;
        const centerX = event.clientX + window.scrollX - textWidth / 2;
        const centerY = event.clientY + window.scrollY - textHeight / 2;
        
        textElement.style.top = `${centerY}px`;
        textElement.style.left = `${centerX}px`;
        
        document.body.appendChild(textElement);
    }
}

document.addEventListener("mousedown", () => {
	const openGuiButton = document.getElementById("gui-toggle");
    if (guiContainer.style.display !== "none") {
        return;
    }
    const buttonRect = openGuiButton.getBoundingClientRect();
    if (event.clientX >= buttonRect.left && event.clientX <= buttonRect.right && event.clientY >= buttonRect.top && event.clientY <= buttonRect.bottom) {
        return;
    }
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
        textElement.style.zIndex = "0.5";
        textElement.style.color = color;
        textElement.style.userSelect = "none";
        
        const textWidth = textElement.offsetWidth;
        const textHeight = textElement.offsetHeight;
        const centerX = event.clientX + window.scrollX - textWidth / 2;
        const centerY = event.clientY + window.scrollY - textHeight / 2;
        
        textElement.style.top = `${centerY}px`;
        textElement.style.left = `${centerX}px`;
      
        document.body.appendChild(textElement);
    }
});

  
  
}
const clearButton = document.getElementById("clear-button");

function handleClearClick() {
  const pastedTextElements = document.getElementsByClassName("pasted-text");
  while (pastedTextElements.length > 0) {
    pastedTextElements[0].remove();
  }
}

clearButton.addEventListener("click", handleClearClick);
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
